import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';

import MapView, {
  Marker,
  Polyline,
  AnimatedRegion,
} from 'react-native-maps';

const Livetrakingmap = () => {
  const mapRef = useRef(null);

  const demoLocations = [
    {latitude: 28.6139, longitude: 77.2090},
    {latitude: 28.6160, longitude: 77.2200},
    {latitude: 28.6200, longitude: 77.2350},
    {latitude: 28.6170, longitude: 77.2500},
    {latitude: 28.6100, longitude: 77.2700},
    {latitude: 28.6000, longitude: 77.2900},
    {latitude: 28.5900, longitude: 77.3100},
    {latitude: 28.5750, longitude: 77.3300},
    {latitude: 28.5550, longitude: 77.3550},
    {latitude: 28.5355, longitude: 77.3910},
  ];

  const [locations, setLocations] = useState([
    {
      ...demoLocations[0],
      time: Date.now(),
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [speedKmh, setSpeedKmh] = useState(0);
  const [etaSeconds, setEtaSeconds] = useState(null);
  const [heading, setHeading] = useState(0);

  const startTimeRef = useRef(Date.now());
  const rotationAnim = useRef(new Animated.Value(0)).current;

  const animatedCoordinate = useRef(
    new AnimatedRegion({
      latitude: demoLocations[0].latitude,
      longitude: demoLocations[0].longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }),
  ).current;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();

      const seconds = Math.floor(
        (now - startTimeRef.current) / 1000,
      );

      setElapsedTime(seconds);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Bearing between two coordinates, used to rotate the car marker
  const getBearing = (lat1, lon1, lat2, lon2) => {
    const toRad = deg => (deg * Math.PI) / 180;
    const toDeg = rad => (rad * 180) / Math.PI;

    const dLon = toRad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(toRad(lat2));
    const x =
      Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
      Math.sin(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.cos(dLon);

    const brng = (toDeg(Math.atan2(y, x)) + 360) % 360;
    return brng;
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const calculateTotalDistance = () => {
    let total = 0;

    for (let i = 1; i < locations.length; i++) {
      total += getDistance(
        locations[i - 1].latitude,
        locations[i - 1].longitude,
        locations[i].latitude,
        locations[i].longitude,
      );
    }

    return total;
  };

  const calculateRemainingDistance = () => {
    let total = 0;
    const current = locations[locations.length - 1];

    // remaining path from current index to end of demoLocations
    const remainingPoints = [current, ...demoLocations.slice(currentIndex + 1)];

    for (let i = 1; i < remainingPoints.length; i++) {
      total += getDistance(
        remainingPoints[i - 1].latitude,
        remainingPoints[i - 1].longitude,
        remainingPoints[i].latitude,
        remainingPoints[i].longitude,
      );
    }

    return total;
  };

  useEffect(() => {
    if (currentIndex >= demoLocations.length - 1) {
      setEtaSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      const nextIndex = currentIndex + 1;
      const prevCoordinate = demoLocations[currentIndex];
      const newCoordinate = demoLocations[nextIndex];

      // bearing + rotate marker smoothly
      const bearing = getBearing(
        prevCoordinate.latitude,
        prevCoordinate.longitude,
        newCoordinate.latitude,
        newCoordinate.longitude,
      );

      setHeading(bearing);

      Animated.timing(rotationAnim, {
        toValue: bearing,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();

      // speed: distance covered in this hop / time taken (3s tick, hop takes 1.8s move)
      const hopDistanceKm = getDistance(
        prevCoordinate.latitude,
        prevCoordinate.longitude,
        newCoordinate.latitude,
        newCoordinate.longitude,
      );
      const hopTimeHours = 1.8 / 3600; // matches animation duration
      const currentSpeed = hopDistanceKm / hopTimeHours;
      setSpeedKmh(currentSpeed);

      animatedCoordinate
        .timing({
          latitude: newCoordinate.latitude,
          longitude: newCoordinate.longitude,
          duration: 1800,
          useNativeDriver: false,
        })
        .start();

      setLocations(prev => [
        ...prev,
        {
          ...newCoordinate,
          time: Date.now(),
        },
      ]);

      setCurrentIndex(nextIndex);

      mapRef.current?.animateCamera(
        {
          center: newCoordinate,
          zoom: 13,
        },
        {
          duration: 1000,
        },
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Recalculate ETA whenever speed or position changes
  useEffect(() => {
    const remainingKm = calculateRemainingDistance();
    const effectiveSpeed = speedKmh > 1 ? speedKmh : 25; // fallback avg speed

    if (currentIndex >= demoLocations.length - 1) {
      setEtaSeconds(0);
    } else {
      const hours = remainingKm / effectiveSpeed;
      setEtaSeconds(Math.round(hours * 3600));
    }
  }, [currentIndex, speedKmh]);

  const formatTime = seconds => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatEta = seconds => {
    if (seconds === null) return '--';
    if (seconds <= 0) return 'Arrived';

    const mins = Math.round(seconds / 60);
    if (mins < 1) return '<1 min';
    if (mins < 60) return `${mins} min`;

    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins}m`;
  };

  const getStatus = () => {
    if (currentIndex === 0) return 'Order Picked Up';
    if (currentIndex >= demoLocations.length - 1) return 'Arrived';
    return 'On the way';
  };

  const progressPercent =
    (currentIndex / (demoLocations.length - 1)) * 100;

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const startPoint = locations[0];
  const endPoint = demoLocations[demoLocations.length - 1];
  const currentPoint = locations[locations.length - 1];

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: startPoint.latitude,
          longitude: startPoint.longitude,
          latitudeDelta: 0.25,
          longitudeDelta: 0.25,
        }}>

        <Marker
          coordinate={startPoint}
          title="Start"
          description="Employee started here"
          pinColor="green"
        />

        <Marker coordinate={endPoint} title="Destination" pinColor="red" />

        {locations.length > 1 && (
          <Polyline
            coordinates={locations}
            strokeWidth={5}
            strokeColor="blue"
          />
        )}

        {/* remaining path shown lighter/dashed */}
        {currentIndex < demoLocations.length - 1 && (
          <Polyline
            coordinates={[
              currentPoint,
              ...demoLocations.slice(currentIndex + 1),
            ]}
            strokeWidth={3}
            strokeColor="#9BB8FF"
            lineDashPattern={[8, 6]}
          />
        )}

        <Marker.Animated
          coordinate={animatedCoordinate}
          title="Employee"
          anchor={{x: 0.5, y: 0.5}}>
          <Animated.View
            style={[
              styles.employeeMarker,
              {transform: [{rotate: rotateInterpolate}]},
            ]}>
            <Text style={styles.employeeIcon}>🚗</Text>
          </Animated.View>
        </Marker.Animated>
      </MapView>

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Live Employee Tracking</Text>
            <Text style={styles.headerSubtitle}>Delhi → Noida</Text>
          </View>

          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{getStatus()}</Text>
          </View>
        </View>

        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {width: `${progressPercent}%`},
            ]}
          />
        </View>
      </View>

      <View style={styles.bottomCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.label}>Distance</Text>
            <Text style={styles.value}>
              {calculateTotalDistance().toFixed(2)} KM
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.label}>Travel Time</Text>
            <Text style={styles.value}>{formatTime(elapsedTime)}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.label}>Speed</Text>
            <Text style={styles.value}>{speedKmh.toFixed(0)} km/h</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.label}>ETA</Text>
            <Text style={[styles.value, styles.etaValue]}>
              {formatEta(etaSeconds)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.locationRow}>
          <Text style={styles.label}>Current Location</Text>
          <Text style={styles.coordinateText}>
            {currentPoint.latitude.toFixed(5)}
            {' , '}
            {currentPoint.longitude.toFixed(5)}
          </Text>
        </View>

        <Text style={styles.progressText}>
          Tracking point {currentIndex + 1} of {demoLocations.length} ·
          Heading {Math.round(heading)}°
        </Text>
      </View>

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading tracking...</Text>
        </View>
      )}
    </View>
  );
};

export default Livetrakingmap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  headerSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: '#666',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF7EE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#2ECC71',
    marginRight: 6,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#219150',
  },

  progressBarBg: {
    height: 5,
    backgroundColor: '#eee',
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },

  bottomCard: {
    position: 'absolute',
    bottom: 25,
    left: 15,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  statItem: {
    width: '48%',
  },

  label: {
    fontSize: 12,
    color: '#777',
  },

  value: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  etaValue: {
    color: '#3B82F6',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },

  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  coordinateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },

  progressText: {
    marginTop: 12,
    fontSize: 12,
    color: '#666',
  },

  employeeMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  employeeIcon: {
    fontSize: 34,
  },

  loader: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },

  loadingText: {
    marginTop: 8,
    color: '#333',
  },
});