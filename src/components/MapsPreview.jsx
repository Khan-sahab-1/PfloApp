// // import {
// //   Modal,
// //   NativeModules,
// //   Pressable,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   useColorScheme,
// //   View,
// //   ScrollView,
// // } from 'react-native';
// // import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
// // import {SafeAreaView} from 'react-native-safe-area-context';
// // import axios from 'axios';
// // import {AuthContext} from '../Screens/Context';
// // import urls from '../../url';
// // import SingleDropdown from './SingleDropdown';
// // import CalendarInput from './CalendarInput';
// // import {COLORS} from '../styles/Colors';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
// // import MapViewDirections from 'react-native-maps-directions';

// // const getTodayDate = () => {
// //   const today = new Date();
// //   const year = today.getFullYear();
// //   const month = String(today.getMonth() + 1).padStart(2, '0');
// //   const day = String(today.getDate()).padStart(2, '0');
// //   return `${year}-${month}-${day}`;
// // };

// // const getRouteItems = data => {
// //   if (Array.isArray(data)) {
// //     return data;
// //   }

// //   const possibleRoutes = [
// //     data?.points,
// //     data?.route,
// //     data?.locations,
// //     data?.tracking_data,
// //     data?.coordinates,
// //     data?.data,
// //     data?.route?.points,
// //     data?.route?.locations,
// //   ];

// //   return possibleRoutes.find(Array.isArray) ?? (data ? [data] : []);
// // };

// // const normalizeCoordinate = item => {
// //   const latitude = Number(
// //     Array.isArray(item) ? item[0] : item?.latitude ?? item?.lat,
// //   );
// //   const longitude = Number(
// //     Array.isArray(item) ? item[1] : item?.longitude ?? item?.lng ?? item?.lon,
// //   );

// //   if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
// //     return null;
// //   }

// //   return {
// //     latitude,
// //     longitude,
// //     recordedAt: item?.time_local ?? item?.time ?? null,
// //     address: item?.address ?? '',
// //     pointId: item?.id ?? null,
// //   };
// // };

// // const sortPointsByTime = points =>
// //   [...points].sort((first, second) => {
// //     const firstTime = String(first?.time_local ?? first?.time ?? '');
// //     const secondTime = String(second?.time_local ?? second?.time ?? '');
// //     const timeComparison = firstTime.localeCompare(secondTime);

// //     if (timeComparison !== 0) {
// //       return timeComparison;
// //     }

// //     return Number(first?.id ?? 0) - Number(second?.id ?? 0);
// //   });

// // const toRadians = degrees => (degrees * Math.PI) / 180;

// // const distanceInKm = (from, to) => {
// //   const earthRadiusKm = 6371;
// //   const latitudeDistance = toRadians(to.latitude - from.latitude);
// //   const longitudeDistance = toRadians(to.longitude - from.longitude);
// //   const value =
// //     Math.sin(latitudeDistance / 2) ** 2 +
// //     Math.cos(toRadians(from.latitude)) *
// //       Math.cos(toRadians(to.latitude)) *
// //       Math.sin(longitudeDistance / 2) ** 2;
// //   return earthRadiusKm * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
// // };

// // const MapsPreview = ({navigation}) => {
// //   const mapRef = useRef(null);
// //   const colorScheme = useColorScheme(); // 'light' or 'dark'
// //   const isDark = colorScheme === 'dark';
// //   const [isLoding, setIsLoading] = React.useState(false);
// //   const [isRouteLoading, setIsRouteLoading] = useState(false);
// //   const [isMapReady, setIsMapReady] = useState(false);
// //   const [employeeOptions, setEmployeeOptions] = useState([]);
// //   const [selectedEmployee, setSelectedEmployee] = useState(null);
// //   const [selectedPoint, setSelectedPoint] = useState(null);
// //   const [routeData, setRouteData] = useState(null);
// //   const contextType = useContext(AuthContext);
// //   const server_origin = contextType.currentUrl;
// //   const [queryraiseddate, setqueryraiseddate] = useState(getTodayDate);
// //   const [isHistoryVisible, setIsHistoryVisible] = useState(false);
// //   const [roadCoordinates, setRoadCoordinates] = useState([]);
// //   const [isRoadRouteLoading, setIsRoadRouteLoading] = useState(false);
// //   const [directionsError, setDirectionsError] = useState('');
// //   const [directionsDistance, setDirectionsDistance] = useState(0);
// //   const mapsApiKey = NativeModules.GoogleMapsConfig?.apiKey ?? '';

// //   const routeCoordinates = useMemo(
// //     () =>
// //       sortPointsByTime(getRouteItems(routeData))
// //         .map(normalizeCoordinate)
// //         .filter(Boolean),
// //     [routeData],
// //   );

// //   const distinctRouteCoordinates = useMemo(
// //     () =>
// //       routeCoordinates.filter(
// //         (point, index, points) =>
// //           index === 0 ||
// //           point.latitude !== points[index - 1].latitude ||
// //           point.longitude !== points[index - 1].longitude,
// //       ),
// //     [routeCoordinates],
// //   );

// //   const displayRouteCoordinates =
// //     distinctRouteCoordinates.length === 1
// //       ? distinctRouteCoordinates
// //       : roadCoordinates;

// //   useEffect(() => {
// //     setRoadCoordinates([]);
// //     setDirectionsDistance(0);
// //     const needsDirections = distinctRouteCoordinates.length > 1;
// //     setDirectionsError(
// //       needsDirections && !mapsApiKey
// //         ? 'Google Maps API key app mein available nahi hai.'
// //         : '',
// //     );
// //     setIsRoadRouteLoading(needsDirections && Boolean(mapsApiKey));
// //   }, [distinctRouteCoordinates, mapsApiKey]);

// //   const totalDistance = useMemo(
// //     () =>
// //       directionsDistance || displayRouteCoordinates.reduce(
// //         (total, point, index) =>
// //           index === 0
// //             ? total
// //             : total + distanceInKm(displayRouteCoordinates[index - 1], point),
// //         0,
// //       ),
// //     [directionsDistance, displayRouteCoordinates],
// //   );

// //   useEffect(() => {
// //     if (!isMapReady || !displayRouteCoordinates.length) {
// //       return;
// //     }

// //     const frame = requestAnimationFrame(() => {
// //       if (displayRouteCoordinates.length === 1) {
// //         mapRef.current?.animateToRegion(
// //           {
// //             ...displayRouteCoordinates[0],
// //             latitudeDelta: 0.01,
// //             longitudeDelta: 0.01,
// //           },
// //           500,
// //         );
// //       } else {
// //         mapRef.current?.fitToCoordinates(displayRouteCoordinates, {
// //           edgePadding: {top: 55, right: 55, bottom: 55, left: 55},
// //           animated: true,
// //         });
// //       }
// //     });

// //     return () => cancelAnimationFrame(frame);
// //   }, [displayRouteCoordinates, isMapReady]);

// //   const openPointDetails = (point, index) => {
// //     setSelectedPoint({...point, index});
// //   };

// //   const handleMapPress = event => {
// //     if (!routeCoordinates.length) {
// //       return;
// //     }

// //     const pressedCoordinate = event.nativeEvent.coordinate;
// //     const nearestPoint = routeCoordinates.reduce(
// //       (nearest, point, index) => {
// //         const distance =
// //           Math.pow(point.latitude - pressedCoordinate.latitude, 2) +
// //           Math.pow(point.longitude - pressedCoordinate.longitude, 2);
// //         return distance < nearest.distance ? {point, index, distance} : nearest;
// //       },
// //       {point: routeCoordinates[0], index: 0, distance: Infinity},
// //     );

// //     openPointDetails(nearestPoint.point, nearestPoint.index);
// //   };

// //   const fectchEmployeeList = async () => {
// //     try {
// //       setIsLoading(true);

// //       const apiUrl = `${server_origin}${urls.GETALLEMPLOYEES}`;

// //       const res = await axios.post(
// //         apiUrl,
// //         {
// //           jsonrpc: '2.0',
// //           method: 'call',
// //           params: {},
// //         },
// //         {
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //           timeout: 15000,
// //         },
// //       );

// //       // Supports both JSON-RPC and direct REST response structures.
// //       const employees =
// //         res.data?.result?.employees ?? res.data?.employees ?? [];

// //       const options = employees
// //         .filter(employee => employee?.id != null && employee?.name?.trim())
// //         .map(employee => {
// //           const name = employee.name.trim();
// //           const employeeCode = employee.emp_code?.trim();

// //           return {
// //             label: employeeCode ? `${name} (${employeeCode})` : name,
// //             value: String(employee.id),
// //             employee,
// //           };
// //         });

// //       setEmployeeOptions(options);
// //       if (!options.length) {
// //         console.log('No valid employee data found.');
// //       }
// //     } catch (err) {
// //       setEmployeeOptions([]);
// //       console.log('Error message:', err.message);
// //       console.log('Error code:', err.code);
// //       console.log('Error response:', err.response);
// //       console.log('Error request:', err.request);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fectchEmployeeList();
// //   }, []);

// //   const fectchEmployeRoute = async (employeeId, date, signal) => {
// //     try {
// //       setIsRouteLoading(true);

// //       const apiUrl = `${server_origin}${urls.LIVELOCATIONROUTE}`;

// //       const res = await axios.post(
// //         apiUrl,
// //         {
// //           jsonrpc: '2.0',
// //           method: 'call',
// //           params: {
// //             employee_id: employeeId,
// //             date,
// //           },
// //         },
// //         {
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //           timeout: 15000,
// //           signal,
// //         },
// //       );

// //       // Supports JSON-RPC ({result: ...}) and direct REST responses.
// //       const nextRouteData = res.data?.result ?? res.data ?? null;
// //       setRouteData(nextRouteData);
// //       console.log('Employee route data:', nextRouteData);
// //     } catch (err) {
// //       if (axios.isCancel(err) || err.code === 'ERR_CANCELED') {
// //         return;
// //       }
// //       setRouteData(null);
// //       console.log('Error message:', err.message);
// //       console.log('Error code:', err.code);
// //       console.log('Error response:', err.response);
// //       console.log('Error request:', err.request);
// //     } finally {
// //       if (!signal?.aborted) {
// //         setIsRouteLoading(false);
// //       }
// //     }
// //   };

// //   useEffect(() => {
// //     if (!selectedEmployee || !queryraiseddate) {
// //       setRouteData(null);
// //       return undefined;
// //     }

// //     const controller = new AbortController();
// //     fectchEmployeRoute(selectedEmployee, queryraiseddate, controller.signal);

// //     return () => controller.abort();
// //   }, [selectedEmployee, queryraiseddate, server_origin]);

// //   useEffect(() => {
// //     if (!selectedEmployee || queryraiseddate !== getTodayDate()) {
// //       return undefined;
// //     }
// //     const refreshTimer = setInterval(() => {
// //       fectchEmployeRoute(selectedEmployee, queryraiseddate);
// //     }, 30000);
// //     return () => clearInterval(refreshTimer);
// //   }, [selectedEmployee, queryraiseddate, server_origin]);

// //   return (
// //     <SafeAreaView style={{flex: 1}}>
// //       {/* <HeaderCompo title={'Live Tracking'} /> */}
// //       <View style={styles.header}>
// //   {/* Back Icon */}
// //   <TouchableOpacity
// //     onPress={() => navigation.goBack()}
// //     style={styles.backButton}>
// //     <Ionicons
// //       name="arrow-back"
// //       size={26}
// //       color={isDark ? '#fff' : '#0C1F3A'}
// //     />
// //   </TouchableOpacity>

// //   {/* Title */}
// //   <View style={styles.titleContainer}>
// //     <Text
// //       style={[
// //         styles.title,
// //         {color: isDark ? '#fff' : '#0C1F3A'},
// //       ]}>
// //       Live Location of Employee
// //     </Text>
// //   </View>

// //   {/* Balance right side */}
// //   <View style={styles.rightSpace} />
// // </View>
// //       <View style={{flex: 1, paddingHorizontal: 15}}>
// //         <SingleDropdown
// //           data={employeeOptions}
// //           label="Select Employee"
// //           value={selectedEmployee}
// //           onChange={item => setSelectedEmployee(item.value)}
// //           placeholder={
// //             isLoding
// //               ? 'Loading employees...'
// //               : employeeOptions.length
// //               ? 'Select Employee'
// //               : 'No employees found'
// //           }
// //         />
// //         <Text style={styles.label}>Select Date</Text>
// //         <CalendarInput
// //           value={queryraiseddate}
// //           onChange={setqueryraiseddate}
// //           placeholder="Select Raised Date"
// //           COLORS={COLORS.white}
// //           style={{
// //             backgroundColor: isDark ? '#1C1C1E' : '#fff',
// //             color: isDark ? '#fff' : '#0C1F3A',
// //             fontSize: 16,
// //             borderWidth: 1,
// //             borderRadius: 6,
// //             paddingHorizontal: 10,
// //             paddingVertical: 12,
// //           }}
// //         />
// //         {isRouteLoading && (
// //           <Text style={styles.helperText}>Loading employee route...</Text>
// //         )}
// //         {!isRouteLoading && isRoadRouteLoading && (
// //           <Text style={styles.helperText}>Finding driving route on roads...</Text>
// //         )}
// //         {!isRouteLoading && directionsError ? (
// //           <Text style={styles.routeErrorText}>{directionsError}</Text>
// //         ) : null}
// //         {!isRouteLoading && selectedEmployee && !routeCoordinates.length && (
// //           <Text style={styles.helperText}>No route found for this date.</Text>
// //         )}
// //         {!isRouteLoading && routeCoordinates.length > 0 && (
// //           <>
// //             <View style={styles.journeySummary}>
// //               <View style={styles.employeeSummary}>
// //                 <Text style={styles.routeSummary} numberOfLines={1}>
// //                   {routeData?.employee_name?.trim() || 'Employee'}
// //                 </Text>
// //                 <Text style={styles.routeMeta}>
// //                   {routeCoordinates.length} GPS points • {totalDistance.toFixed(2)} km
// //                 </Text>
// //               </View>
// //               <TouchableOpacity
// //                 activeOpacity={0.75}
// //                 onPress={() => setIsHistoryVisible(true)}>
// //                 <Text style={styles.locationText}>View history</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </>
// //         )}
// //         {!isRouteLoading &&
// //           routeCoordinates.length > 1 &&
// //           distinctRouteCoordinates.length === 1 && (
// //             <Text style={styles.noMovementText}>
// //               All updates have the same location. No movement route is available
// //               yet.
// //             </Text>
// //           )}
// //         <View style={styles.mapContainer}>
// //           <MapView
// //             ref={mapRef}
// //             style={styles.map}
// //             provider={PROVIDER_GOOGLE}
// //             onMapReady={() => setIsMapReady(true)}
// //             onPress={handleMapPress}
// //             initialRegion={{
// //               latitude: 28.6139,
// //               longitude: 77.209,
// //               latitudeDelta: 0.1,
// //               longitudeDelta: 0.1,
// //             }}>
// //             {isMapReady &&
// //               mapsApiKey &&
// //               distinctRouteCoordinates.length > 1 && (
// //                 <MapViewDirections
// //                   key={`directions-${selectedEmployee}-${queryraiseddate}-${distinctRouteCoordinates.length}`}
// //                   origin={distinctRouteCoordinates[0]}
// //                   destination={
// //                     distinctRouteCoordinates[
// //                       distinctRouteCoordinates.length - 1
// //                     ]
// //                   }
// //                   waypoints={distinctRouteCoordinates.slice(1, -1)}
// //                   apikey={mapsApiKey}
// //                   mode="DRIVING"
// //                   precision="high"
// //                   optimizeWaypoints={false}
// //                   splitWaypoints
// //                   resetOnChange={false}
// //                   strokeWidth={0}
// //                   strokeColor="transparent"
// //                   onStart={() => {
// //                     setDirectionsError('');
// //                     setIsRoadRouteLoading(true);
// //                   }}
// //                   onReady={result => {
// //                     const coordinates = result?.coordinates ?? [];
// //                     setRoadCoordinates(coordinates);
// //                     setDirectionsDistance(Number(result?.distance) || 0);
// //                     setIsRoadRouteLoading(false);
// //                     if (coordinates.length > 1) {
// //                       mapRef.current?.fitToCoordinates(coordinates, {
// //                         edgePadding: {
// //                           top: 55,
// //                           right: 55,
// //                           bottom: 55,
// //                           left: 55,
// //                         },
// //                         animated: true,
// //                       });
// //                     }
// //                   }}
// //                   onError={message => {
// //                     setRoadCoordinates([]);
// //                     setIsRoadRouteLoading(false);
// //                     setDirectionsError(
// //                       'Road route load nahi hua. Directions API key/config check karein.',
// //                     );
// //                     console.warn('Google driving route error:', message);
// //                   }}
// //                 />
// //               )}
// //             {isMapReady && displayRouteCoordinates.length > 1 && (
// //               <>
// //                 <Polyline
// //                   key={`route-outline-${selectedEmployee}-${queryraiseddate}`}
// //                   coordinates={displayRouteCoordinates}
// //                   strokeColor="#FFFFFF"
// //                   strokeWidth={9}
// //                   geodesic={false}
// //                   zIndex={998}
// //                   lineCap="round"
// //                   lineJoin="round"
// //                 />
// //                 <Polyline
// //                   key={`employee-route-${selectedEmployee}-${queryraiseddate}`}
// //                   coordinates={displayRouteCoordinates}
// //                   strokeColor="#8B5CF6"
// //                   strokeWidth={6}
// //                   geodesic={false}
// //                   zIndex={999}
// //                   lineCap="round"
// //                   lineJoin="round"
// //                 />
// //               </>
// //             )}
// //             {routeCoordinates.map((point, index) => (
// //               <Marker
// //                 key={`gps-hit-${point.pointId ?? index}-${index}`}
// //                 coordinate={point}
// //                 title={`GPS hit ${index + 1}`}
// //                 description={
// //                   [point.recordedAt, point.address].filter(Boolean).join(' • ') ||
// //                   undefined
// //                 }
// //                 onPress={() => openPointDetails(point, index)}
// //                 anchor={{x: 0.5, y: 1}}
// //                 zIndex={1002}>
// //                 <View
// //                   style={[
// //                     styles.hitMarker,
// //                     index === 0 && styles.startMarker,
// //                     index === routeCoordinates.length - 1 && styles.endMarker,
// //                   ]}>
// //                   <Ionicons name="flag" size={15} color="#FFFFFF" />
// //                   <Text style={styles.hitNumber}>{index + 1}</Text>
// //                 </View>
// //               </Marker>
// //             ))}
// //           </MapView>
// //         </View>
// //       </View>
// //       <Modal
// //         transparent
// //         visible={Boolean(selectedPoint)}
// //         animationType="slide"
// //         statusBarTranslucent
// //         hardwareAccelerated
// //         presentationStyle="overFullScreen"
// //         onRequestClose={() => setSelectedPoint(null)}>
// //         <Pressable
// //           style={styles.modalBackdrop}
// //           onPress={() => setSelectedPoint(null)}>
// //           <Pressable
// //             style={styles.bottomSheet}
// //             onPress={event => event.stopPropagation()}>
// //             <View style={styles.sheetHandle} />
// //             <View style={styles.sheetHeader}>
// //               <View>
// //                 <Text style={styles.sheetEyebrow}>LOCATION DETAILS</Text>
// //                 <Text style={styles.sheetTitle}>
// //                   Point {(selectedPoint?.index ?? 0) + 1}
// //                 </Text>
// //               </View>
// //               <TouchableOpacity
// //                 activeOpacity={0.75}
// //                 style={styles.closeButton}
// //                 onPress={() => setSelectedPoint(null)}>
// //                 <Text style={styles.closeButtonText}>×</Text>
// //               </TouchableOpacity>
// //             </View>
// //             <View style={styles.addressCard}>
// //               <Text style={styles.detailLabel}>ADDRESS</Text>
// //               <Text style={styles.addressText}>
// //                 {selectedPoint?.address || 'Address not available'}
// //               </Text>
// //             </View>
// //             <View style={styles.coordinateRow}>
// //               <View style={styles.coordinateCard}>
// //                 <Text style={styles.detailLabel}>LATITUDE</Text>
// //                 <Text style={styles.coordinateValue}>
// //                   {selectedPoint?.latitude?.toFixed(7) ?? '--'}
// //                 </Text>
// //               </View>
// //               <View style={styles.coordinateCard}>
// //                 <Text style={styles.detailLabel}>LONGITUDE</Text>
// //                 <Text style={styles.coordinateValue}>
// //                   {selectedPoint?.longitude?.toFixed(7) ?? '--'}
// //                 </Text>
// //               </View>
// //             </View>
// //             <View style={styles.timeRow}>
// //               <Text style={styles.detailLabel}>RECORDED AT</Text>
// //               <Text style={styles.timeValue}>
// //                 {selectedPoint?.recordedAt || 'Time not available'}
// //               </Text>
// //             </View>
// //           </Pressable>
// //         </Pressable>
// //       </Modal>
// //        <Modal
// //         transparent
// //         visible={isHistoryVisible}
// //         animationType="slide"
// //         statusBarTranslucent
// //         hardwareAccelerated
// //         presentationStyle="overFullScreen"
// //         onRequestClose={() => setIsHistoryVisible(false)}>
// //         <Pressable
// //           style={styles.modalBackdrop}
// //           onPress={() => setIsHistoryVisible(false)}>
// //           <Pressable
// //             style={[styles.bottomSheet, styles.historySheet]}
// //             onPress={event => event.stopPropagation()}>
// //             <View style={styles.sheetHandle} />
// //             <View style={styles.sheetHeader}>
// //               <View style={styles.historyHeading}>
// //                 <Text style={styles.sheetEyebrow}>FULL DAY JOURNEY</Text>
// //                 <Text style={styles.sheetTitle}>Today's locations</Text>
// //                 <Text style={styles.historySubtitle} numberOfLines={1}>
// //                   {routeData?.employee_name?.trim() || 'Employee'} •{' '}
// //                   {queryraiseddate} • {routeCoordinates.length} hits
// //                 </Text>
// //               </View>
// //               <TouchableOpacity
// //                 activeOpacity={0.75}
// //                 style={styles.closeButton}
// //                 onPress={() => setIsHistoryVisible(false)}>
// //                 <Text style={styles.closeButtonText}>×</Text>
// //               </TouchableOpacity>
// //             </View>

// //             <ScrollView
// //               showsVerticalScrollIndicator={false}
// //               contentContainerStyle={styles.historyList}>
// //               {routeCoordinates.map((point, index) => (
// //                 <TouchableOpacity
// //                   key={
// //                     point.pointId ??
// //                     `history-${point.latitude}-${point.longitude}-${index}`
// //                   }
// //                   activeOpacity={0.8}
// //                   style={styles.historyCard}
// //                   onPress={() => {
// //                     setIsHistoryVisible(false);
// //                     setSelectedPoint({...point, index});
// //                     mapRef.current?.animateToRegion(
// //                       {
// //                         latitude: point.latitude,
// //                         longitude: point.longitude,
// //                         latitudeDelta: 0.008,
// //                         longitudeDelta: 0.008,
// //                       },
// //                       450,
// //                     );
// //                   }}>
// //                   <View style={styles.timelineColumn}>
// //                     <View
// //                       style={[
// //                         styles.timelineDot,
// //                         index === 0 && styles.timelineDotStart,
// //                         index === routeCoordinates.length - 1 &&
// //                           styles.timelineDotEnd,
// //                       ]}
// //                     />
// //                     {index < routeCoordinates.length - 1 && (
// //                       <View style={styles.timelineLine} />
// //                     )}
// //                   </View>
// //                   <View style={styles.historyCardContent}>
// //                     <View style={styles.historyCardHeader}>
// //                       <Text style={styles.historyPointTitle}>
// //                         Location {index + 1}
// //                       </Text>
// //                       <Text style={styles.historyTime}>
// //                         {point.recordedAt || 'Time unavailable'}
// //                       </Text>
// //                     </View>
// //                     <Text style={styles.historyAddress} numberOfLines={2}>
// //                       {point.address || 'Address not available'}
// //                     </Text>
// //                     <Text style={styles.historyCoordinates}>
// //                       {point.latitude.toFixed(7)}, {point.longitude.toFixed(7)}
// //                     </Text>
// //                   </View>
// //                 </TouchableOpacity>
// //               ))}
// //             </ScrollView>
// //           </Pressable>
// //         </Pressable>
// //       </Modal>
// //     </SafeAreaView>
// //   );
// // };

// // export default MapsPreview;

// // const styles = StyleSheet.create({
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     // height: 55,
// //     paddingHorizontal: 15,
// //   },

// //   backButton: {
// //     width: 40,
// //     justifyContent: 'center',
// //     alignItems: 'flex-start',
// //   },

// //   titleContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },

// //   title: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //   },

// //   rightSpace: {
// //     width: 40,
// //   },
// //   label: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#0C1F3A',
// //   },
// //   helperText: {
// //     marginTop: 10,
// //     color: '#667085',
// //     fontSize: 13,
// //   },
// //   routeErrorText: {
// //     color: '#DC2626',
// //     fontSize: 12,
// //     fontWeight: '700',
// //     marginTop: 6,
// //   },
// //   routeSummary: {
// //     color: '#10233E',
// //     fontSize: 14,
// //     fontWeight: '800',
// //   },
// //   journeySummary: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: 10,
// //   },
// //   employeeSummary: {flex: 1},
// //   routeMeta: {color: '#667085', fontSize: 11, marginTop: 3},
// //   playbackBar: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     marginTop: 10,
// //   },
// //   playButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#4F46E5',
// //     borderRadius: 12,
// //     paddingHorizontal: 13,
// //     paddingVertical: 9,
// //   },
// //   playButtonText: {
// //     color: '#FFFFFF',
// //     fontSize: 12,
// //     fontWeight: '800',
// //     marginLeft: 6,
// //   },
// //   routeLegend: {flexDirection: 'row', alignItems: 'center'},
// //   legendDot: {width: 8, height: 8, borderRadius: 4, marginLeft: 8},
// //   startLegend: {backgroundColor: '#16A34A'},
// //   endLegend: {backgroundColor: '#F97316'},
// //   legendText: {color: '#667085', fontSize: 10, marginLeft: 4},
// //   noMovementText: {
// //     marginTop: 6,
// //     color: '#B54708',
// //     fontSize: 12,
// //     lineHeight: 17,
// //   },
// //   mapContainer: {
// //     flex: 1,
// //     minHeight: 300,
// //     marginTop: 14,
// //     marginBottom: 10,
// //     borderRadius: 14,
// //     overflow: 'hidden',
// //   },
// //   map: {
// //     ...StyleSheet.absoluteFillObject,
// //   },
// //   locationText: {
// //     color: '#176BFF',
// //     fontSize: 12,
// //     fontWeight: '800',
// //   },
// //   hitMarker: {
// //     minWidth: 38,
// //     height: 30,
// //     borderRadius: 15,
// //     paddingHorizontal: 7,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     gap: 3,
// //     backgroundColor: '#4F46E5',
// //     borderWidth: 3,
// //     borderColor: '#FFFFFF',
// //     shadowColor: '#000000',
// //     shadowOpacity: 0.25,
// //     shadowRadius: 5,
// //     shadowOffset: {width: 0, height: 2},
// //     elevation: 6,
// //   },
// //   hitNumber: {color: '#FFFFFF', fontSize: 10, fontWeight: '900'},
// //   startMarker: {backgroundColor: '#16A34A'},
// //   endMarker: {backgroundColor: '#F97316'},
// //   vehicleMarker: {
// //     width: 43,
// //     height: 43,
// //     borderRadius: 22,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     backgroundColor: '#4F46E5',
// //     borderWidth: 3,
// //     borderColor: '#FFFFFF',
// //     shadowColor: '#000000',
// //     shadowOpacity: 0.3,
// //     shadowRadius: 6,
// //     shadowOffset: {width: 0, height: 3},
// //     elevation: 9,
// //   },
// //   focusButton: {
// //     position: 'absolute',
// //     right: 13,
// //     bottom: 15,
// //     width: 46,
// //     height: 46,
// //     borderRadius: 23,
// //     backgroundColor: '#FFFFFF',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     shadowColor: '#000000',
// //     shadowOpacity: 0.2,
// //     shadowRadius: 6,
// //     shadowOffset: {width: 0, height: 2},
// //     elevation: 7,
// //   },
// //   playingBadge: {
// //     position: 'absolute',
// //     top: 12,
// //     alignSelf: 'center',
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(15, 23, 42, 0.88)',
// //     borderRadius: 20,
// //     paddingHorizontal: 12,
// //     paddingVertical: 8,
// //   },
// //   liveDot: {
// //     width: 7,
// //     height: 7,
// //     borderRadius: 4,
// //     backgroundColor: '#22C55E',
// //     marginRight: 6,
// //   },
// //   playingText: {color: '#FFFFFF', fontSize: 11, fontWeight: '800'},
// //   modalBackdrop: {
// //     flex: 1,
// //     justifyContent: 'flex-end',
// //     backgroundColor: 'rgba(4, 16, 31, 0.48)',
// //     paddingbottom: 100,
// //   },
// //   bottomSheet: {
// //     backgroundColor: '#FFFFFF',
// //     borderTopLeftRadius: 28,
// //     borderTopRightRadius: 28,
// //     paddingHorizontal: 20,
// //     paddingTop: 10,
// //     paddingBottom: 30,
// //   },
// //   sheetHandle: {
// //     alignSelf: 'center',
// //     width: 42,
// //     height: 5,
// //     borderRadius: 3,
// //     backgroundColor: '#D7DEE8',
// //     marginBottom: 18,
// //   },
// //   sheetHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 18,
// //   },
// //   sheetEyebrow: {
// //     color: '#176BFF',
// //     fontSize: 10,
// //     fontWeight: '800',
// //     letterSpacing: 1.1,
// //   },
// //   sheetTitle: {
// //     color: '#10233E',
// //     fontSize: 22,
// //     fontWeight: '800',
// //     marginTop: 3,
// //   },
// //   closeButton: {
// //     width: 38,
// //     height: 38,
// //     borderRadius: 19,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     backgroundColor: '#F1F5F9',
// //   },
// //   closeButtonText: {color: '#334155', fontSize: 26, lineHeight: 28},
// //   addressCard: {
// //     padding: 16,
// //     borderRadius: 18,
// //     backgroundColor: '#EEF4FF',
// //     marginBottom: 12,
// //   },
// //   detailLabel: {
// //     color: '#7B8CA4',
// //     fontSize: 10,
// //     fontWeight: '800',
// //     letterSpacing: 0.8,
// //   },
// //   addressText: {
// //     color: '#10233E',
// //     fontSize: 15,
// //     fontWeight: '600',
// //     lineHeight: 22,
// //     marginTop: 7,
// //   },
// //   coordinateRow: {flexDirection: 'row', gap: 10},
// //   coordinateCard: {
// //     flex: 1,
// //     padding: 14,
// //     borderRadius: 16,
// //     backgroundColor: '#F6F8FC',
// //   },
// //   coordinateValue: {
// //     color: '#10233E',
// //     fontSize: 14,
// //     fontWeight: '800',
// //     marginTop: 7,
// //   },
// //   timeRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 4,
// //     marginTop: 18,
// //   },
// //   timeValue: {color: '#334155', fontSize: 13, fontWeight: '700'},
// //    historySheet: {maxHeight: '82%', paddingBottom: 18},
// //   historyHeading: {flex: 1, paddingRight: 12},
// //   historySubtitle: {color: '#64748B', fontSize: 12, marginTop: 5},
// //   historyList: {paddingBottom: 12},
// //   historyCard: {
// //     flexDirection: 'row',
// //     minHeight: 105,
// //     backgroundColor: '#F8FAFC',
// //     borderRadius: 18,
// //     padding: 14,
// //     marginBottom: 10,
// //   },
// //   timelineColumn: {width: 22, alignItems: 'center'},
// //   timelineDot: {
// //     width: 12,
// //     height: 12,
// //     borderRadius: 6,
// //     backgroundColor: '#176BFF',
// //     borderWidth: 2,
// //     borderColor: '#DCE9FF',
// //   },
// //   timelineDotStart: {backgroundColor: '#16A34A', borderColor: '#DCFCE7'},
// //   timelineDotEnd: {backgroundColor: '#DC2626', borderColor: '#FEE2E2'},
// //   timelineLine: {width: 2, flex: 1, backgroundColor: '#C9DAF8', marginTop: 4},
// //   historyCardContent: {flex: 1, paddingLeft: 9},
// //   historyCardHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'flex-start',
// //     gap: 8,
// //   },
// //   historyPointTitle: {color: '#10233E', fontSize: 14, fontWeight: '800'},
// //   historyTime: {color: '#176BFF', fontSize: 10, fontWeight: '700'},
// //   historyAddress: {
// //     color: '#526277',
// //     fontSize: 12,
// //     lineHeight: 17,
// //     marginTop: 7,
// //   },
// //   historyCoordinates: {
// //     color: '#8A97A8',
// //     fontSize: 10,
// //     fontWeight: '600',
// //     marginTop: 7,
// //   },
// // });




// import {
//   Modal,
//   Pressable,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   useColorScheme,
//   View,
//   ScrollView,
// } from 'react-native';

// import React, {
//   useContext,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';

// import {SafeAreaView} from 'react-native-safe-area-context';
// import axios from 'axios';

// import {AuthContext} from '../Screens/Context';
// import urls from '../../url';
// import SingleDropdown from './SingleDropdown';
// import CalendarInput from './CalendarInput';
// import {COLORS} from '../styles/Colors';

// import Ionicons from 'react-native-vector-icons/Ionicons';

// import MapView, {
//   Marker,
//   Polyline,
//   PROVIDER_GOOGLE,
//   AnimatedRegion,
// } from 'react-native-maps';

// /* =========================================================
//    TODAY DATE
// ========================================================= */

// const getTodayDate = () => {
//   const today = new Date();

//   const year = today.getFullYear();

//   const month = String(
//     today.getMonth() + 1,
//   ).padStart(2, '0');

//   const day = String(
//     today.getDate(),
//   ).padStart(2, '0');

//   return `${year}-${month}-${day}`;
// };

// /* =========================================================
//    ROUTE DATA NORMALIZE
// ========================================================= */

// const getRouteItems = data => {
//   if (Array.isArray(data)) {
//     return data;
//   }

//   const possibleRoutes = [
//     data?.points,
//     data?.route,
//     data?.locations,
//     data?.tracking_data,
//     data?.coordinates,
//     data?.data,
//     data?.route?.points,
//     data?.route?.locations,
//   ];

//   return (
//     possibleRoutes.find(Array.isArray) ??
//     (data ? [data] : [])
//   );
// };

// /* =========================================================
//    NORMALIZE SINGLE COORDINATE
// ========================================================= */

// const normalizeCoordinate = item => {
//   const latitude = Number(
//     Array.isArray(item)
//       ? item[0]
//       : item?.latitude ?? item?.lat,
//   );

//   const longitude = Number(
//     Array.isArray(item)
//       ? item[1]
//       : item?.longitude ??
//           item?.lng ??
//           item?.lon,
//   );

//   if (
//     !Number.isFinite(latitude) ||
//     !Number.isFinite(longitude)
//   ) {
//     return null;
//   }

//   return {
//     latitude,
//     longitude,

//     recordedAt:
//       item?.time_local ??
//       item?.time ??
//       item?.timestamp ??
//       null,

//     address:
//       item?.address ??
//       item?.location_name ??
//       '',

//     pointId:
//       item?.id ??
//       null,
//   };
// };

// /* =========================================================
//    SORT LOCATION BY TIME
// ========================================================= */

// const sortPointsByTime = points =>
//   [...points].sort((first, second) => {
//     const firstTime = String(
//       first?.time_local ??
//         first?.time ??
//         first?.timestamp ??
//         '',
//     );

//     const secondTime = String(
//       second?.time_local ??
//         second?.time ??
//         second?.timestamp ??
//         '',
//     );

//     const timeComparison =
//       firstTime.localeCompare(secondTime);

//     if (timeComparison !== 0) {
//       return timeComparison;
//     }

//     return (
//       Number(first?.id ?? 0) -
//       Number(second?.id ?? 0)
//     );
//   });

// /* =========================================================
//    DISTANCE CALCULATION
// ========================================================= */

// const toRadians = degrees =>
//   (degrees * Math.PI) / 180;

// const distanceInKm = (from, to) => {
//   const earthRadiusKm = 6371;

//   const latitudeDistance =
//     toRadians(
//       to.latitude - from.latitude,
//     );

//   const longitudeDistance =
//     toRadians(
//       to.longitude - from.longitude,
//     );

//   const value =
//     Math.sin(latitudeDistance / 2) ** 2 +
//     Math.cos(
//       toRadians(from.latitude),
//     ) *
//       Math.cos(
//         toRadians(to.latitude),
//       ) *
//       Math.sin(
//         longitudeDistance / 2,
//       ) **
//         2;

//   return (
//     earthRadiusKm *
//     2 *
//     Math.atan2(
//       Math.sqrt(value),
//       Math.sqrt(1 - value),
//     )
//   );
// };

// /* =========================================================
//    MAIN COMPONENT
// ========================================================= */

// const MapsPreview = ({navigation}) => {
//   const mapRef = useRef(null);

//   const colorScheme =
//     useColorScheme();

//   const isDark =
//     colorScheme === 'dark';

//   const contextType =
//     useContext(AuthContext);

//   const server_origin =
//     contextType.currentUrl;

//   /* =========================
//      STATES
//   ========================== */

//   const [isLoding, setIsLoading] =
//     useState(false);

//   const [
//     isRouteLoading,
//     setIsRouteLoading,
//   ] = useState(false);

//   const [
//     isMapReady,
//     setIsMapReady,
//   ] = useState(false);

//   const [
//     employeeOptions,
//     setEmployeeOptions,
//   ] = useState([]);

//   const [
//     selectedEmployee,
//     setSelectedEmployee,
//   ] = useState(null);

//   const [
//     selectedPoint,
//     setSelectedPoint,
//   ] = useState(null);

//   const [
//     routeData,
//     setRouteData,
//   ] = useState(null);

//   const [
//     queryraiseddate,
//     setqueryraiseddate,
//   ] = useState(getTodayDate);

//   const [
//     isHistoryVisible,
//     setIsHistoryVisible,
//   ] = useState(false);

//   const [
//     lastUpdatedAt,
//     setLastUpdatedAt,
//   ] = useState(null);

//   /* =========================
//      LIVE MARKER
//   ========================== */

//   const previousLivePointRef =
//     useRef(null);

//   const liveMarkerCoordinate =
//     useRef(
//       new AnimatedRegion({
//         latitude: 28.6139,
//         longitude: 77.209,

//         latitudeDelta: 0,
//         longitudeDelta: 0,
//       }),
//     ).current;

//   /* =========================================================
//      ROUTE COORDINATES
//   ========================================================= */

//   const routeCoordinates =
//     useMemo(
//       () =>
//         sortPointsByTime(
//           getRouteItems(routeData),
//         )
//           .map(normalizeCoordinate)
//           .filter(Boolean),
//       [routeData],
//     );

//   /* =========================================================
//      REMOVE DUPLICATE CONSECUTIVE POINTS
//   ========================================================= */

//   const distinctRouteCoordinates =
//     useMemo(
//       () =>
//         routeCoordinates.filter(
//           (
//             point,
//             index,
//             points,
//           ) =>
//             index === 0 ||
//             point.latitude !==
//               points[index - 1]
//                 .latitude ||
//             point.longitude !==
//               points[index - 1]
//                 .longitude,
//         ),
//       [routeCoordinates],
//     );

//   /* =========================================================
//      CURRENT / LATEST EMPLOYEE LOCATION
//   ========================================================= */

//   const latestLivePoint =
//     routeCoordinates.length > 0
//       ? routeCoordinates[
//           routeCoordinates.length -
//             1
//         ]
//       : null;

//   /* =========================================================
//      TOTAL DISTANCE
//   ========================================================= */

//   const totalDistance =
//     useMemo(() => {
//       let total = 0;

//       for (
//         let i = 1;
//         i <
//         distinctRouteCoordinates.length;
//         i++
//       ) {
//         total += distanceInKm(
//           distinctRouteCoordinates[
//             i - 1
//           ],
//           distinctRouteCoordinates[i],
//         );
//       }

//       return total;
//     }, [
//       distinctRouteCoordinates,
//     ]);

//   /* =========================================================
//      EMPLOYEE LIST API
//   ========================================================= */

//   const fectchEmployeeList =
//     async () => {
//       try {
//         setIsLoading(true);

//         const apiUrl =
//           `${server_origin}` +
//           `${urls.GETALLEMPLOYEES}`;

//         const res =
//           await axios.post(
//             apiUrl,
//             {
//               jsonrpc: '2.0',
//               method: 'call',
//               params: {},
//             },
//             {
//               headers: {
//                 'Content-Type':
//                   'application/json',
//               },

//               timeout: 15000,
//             },
//           );

//         const employees =
//           res.data?.result
//             ?.employees ??
//           res.data?.employees ??
//           [];

//         const options =
//           employees
//             .filter(
//               employee =>
//                 employee?.id !=
//                   null &&
//                 employee?.name?.trim(),
//             )
//             .map(employee => {
//               const name =
//                 employee.name.trim();

//               const employeeCode =
//                 employee.emp_code?.trim();

//               return {
//                 label: employeeCode
//                   ? `${name} (${employeeCode})`
//                   : name,

//                 value: String(
//                   employee.id,
//                 ),

//                 employee,
//               };
//             });

//         setEmployeeOptions(
//           options,
//         );
//       } catch (err) {
//         setEmployeeOptions([]);

//         console.log(
//           'Employee List Error:',
//           err.message,
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };

//   useEffect(() => {
//     fectchEmployeeList();
//   }, []);

//   /* =========================================================
//      EMPLOYEE ROUTE API
//   ========================================================= */

//   const fectchEmployeRoute =
//     async (
//       employeeId,
//       date,
//       signal,
//     ) => {
//       try {
//         setIsRouteLoading(true);

//         const apiUrl =
//           `${server_origin}` +
//           `${urls.LIVELOCATIONROUTE}`;

//         const res =
//           await axios.post(
//             apiUrl,
//             {
//               jsonrpc: '2.0',

//               method: 'call',

//               params: {
//                 employee_id:
//                   employeeId,

//                 date,
//               },
//             },
//             {
//               headers: {
//                 'Content-Type':
//                   'application/json',
//               },

//               timeout: 15000,

//               signal,
//             },
//           );

//         const nextRouteData =
//           res.data?.result ??
//           res.data ??
//           null;

//         setRouteData(
//           nextRouteData,
//         );

//         console.log(
//           'Employee Live Route:',
//           nextRouteData,
//         );
//       } catch (err) {
//         if (
//           axios.isCancel(err) ||
//           err.code ===
//             'ERR_CANCELED'
//         ) {
//           return;
//         }

//         console.log(
//           'Route API Error:',
//           err.message,
//         );
//       } finally {
//         if (!signal?.aborted) {
//           setIsRouteLoading(
//             false,
//           );
//         }
//       }
//     };

//   /* =========================================================
//      INITIAL ROUTE FETCH
//   ========================================================= */

//   useEffect(() => {
//     if (
//       !selectedEmployee ||
//       !queryraiseddate
//     ) {
//       setRouteData(null);

//       return;
//     }

//     const controller =
//       new AbortController();

//     fectchEmployeRoute(
//       selectedEmployee,
//       queryraiseddate,
//       controller.signal,
//     );

//     return () =>
//       controller.abort();
//   }, [
//     selectedEmployee,
//     queryraiseddate,
//     server_origin,
//   ]);

//   /* =========================================================
//      LIVE REFRESH EVERY 10 SECONDS
//   ========================================================= */

//   useEffect(() => {
//     if (
//       !selectedEmployee ||
//       queryraiseddate !==
//         getTodayDate()
//     ) {
//       return;
//     }

//     const refreshTimer =
//       setInterval(() => {
//         fectchEmployeRoute(
//           selectedEmployee,
//           queryraiseddate,
//         );
//       }, 10000);

//     return () =>
//       clearInterval(
//         refreshTimer,
//       );
//   }, [
//     selectedEmployee,
//     queryraiseddate,
//     server_origin,
//   ]);

//   /* =========================================================
//      LIVE MARKER SMOOTH ANIMATION
//   ========================================================= */

//   useEffect(() => {
//     if (!latestLivePoint) {
//       previousLivePointRef.current =
//         null;

//       return;
//     }

//     const previousPoint =
//       previousLivePointRef.current;

//     /* FIRST LOCATION */

//     if (!previousPoint) {
//       liveMarkerCoordinate.setValue({
//         latitude:
//           latestLivePoint.latitude,

//         longitude:
//           latestLivePoint.longitude,

//         latitudeDelta: 0,

//         longitudeDelta: 0,
//       });
//     } else {
//       const changed =
//         previousPoint.latitude !==
//           latestLivePoint.latitude ||
//         previousPoint.longitude !==
//           latestLivePoint.longitude;

//       if (changed) {
//         liveMarkerCoordinate
//           .timing({
//             latitude:
//               latestLivePoint.latitude,

//             longitude:
//               latestLivePoint.longitude,

//             /*
//               API 10 sec me refresh ho rahi hai.
//               Marker 8 sec me smoothly
//               old point -> new point jayega.
//             */

//             duration: 8000,

//             useNativeDriver:
//               false,
//           })
//           .start();
//       }
//     }

//     previousLivePointRef.current =
//       latestLivePoint;

//     setLastUpdatedAt(
//       new Date(),
//     );
//   }, [
//     latestLivePoint?.latitude,
//     latestLivePoint?.longitude,
//   ]);

//   /* =========================================================
//      AUTO FIT MAP
//   ========================================================= */

//   useEffect(() => {
//     if (
//       !isMapReady ||
//       !distinctRouteCoordinates.length
//     ) {
//       return;
//     }

//     const frame =
//       requestAnimationFrame(
//         () => {
//           if (
//             distinctRouteCoordinates.length ===
//             1
//           ) {
//             mapRef.current?.animateToRegion(
//               {
//                 ...distinctRouteCoordinates[
//                   0
//                 ],

//                 latitudeDelta:
//                   0.01,

//                 longitudeDelta:
//                   0.01,
//               },

//               500,
//             );
//           } else {
//             mapRef.current?.fitToCoordinates(
//               distinctRouteCoordinates,
//               {
//                 edgePadding: {
//                   top: 70,
//                   right: 50,
//                   bottom: 70,
//                   left: 50,
//                 },

//                 animated: true,
//               },
//             );
//           }
//         },
//       );

//     return () =>
//       cancelAnimationFrame(
//         frame,
//       );
//   }, [
//     isMapReady,
//     selectedEmployee,
//     queryraiseddate,
//   ]);

//   /* =========================================================
//      POINT DETAILS
//   ========================================================= */

//   const openPointDetails = (
//     point,
//     index,
//   ) => {
//     setSelectedPoint({
//       ...point,
//       index,
//     });
//   };

//   /* =========================================================
//      MAP PRESS
//   ========================================================= */

//   const handleMapPress =
//     event => {
//       if (
//         !routeCoordinates.length
//       ) {
//         return;
//       }

//       const pressedCoordinate =
//         event.nativeEvent
//           .coordinate;

//       const nearestPoint =
//         routeCoordinates.reduce(
//           (
//             nearest,
//             point,
//             index,
//           ) => {
//             const distance =
//               Math.pow(
//                 point.latitude -
//                   pressedCoordinate.latitude,
//                 2,
//               ) +
//               Math.pow(
//                 point.longitude -
//                   pressedCoordinate.longitude,
//                 2,
//               );

//             return distance <
//               nearest.distance
//               ? {
//                   point,
//                   index,
//                   distance,
//                 }
//               : nearest;
//           },

//           {
//             point:
//               routeCoordinates[0],

//             index: 0,

//             distance: Infinity,
//           },
//         );

//       openPointDetails(
//         nearestPoint.point,
//         nearestPoint.index,
//       );
//     };

//   /* =========================================================
//      CURRENT EMPLOYEE FOCUS
//   ========================================================= */

//   const focusCurrentEmployee =
//     () => {
//       if (!latestLivePoint) {
//         return;
//       }

//       mapRef.current?.animateToRegion(
//         {
//           latitude:
//             latestLivePoint.latitude,

//           longitude:
//             latestLivePoint.longitude,

//           latitudeDelta: 0.008,

//           longitudeDelta:
//             0.008,
//         },

//         500,
//       );
//     };

//   /* =========================================================
//      JSX
//   ========================================================= */

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,

//         backgroundColor: isDark
//           ? '#000'
//           : '#fff',
//       }}>

//       {/* ======================
//           HEADER
//       ======================= */}

//       <View
//         style={styles.header}>

//         <TouchableOpacity
//           onPress={() =>
//             navigation.goBack()
//           }
//           style={
//             styles.backButton
//           }>

//           <Ionicons
//             name="arrow-back"
//             size={26}
//             color={
//               isDark
//                 ? '#fff'
//                 : '#0C1F3A'
//             }
//           />

//         </TouchableOpacity>

//         <View
//           style={
//             styles.titleContainer
//           }>

//           <Text
//             style={[
//               styles.title,

//               {
//                 color: isDark
//                   ? '#fff'
//                   : '#0C1F3A',
//               },
//             ]}>

//             Live Location of Employee

//           </Text>

//         </View>

//         <View
//           style={
//             styles.rightSpace
//           }
//         />

//       </View>

//       {/* ======================
//           MAIN CONTENT
//       ======================= */}

//       <View
//         style={{
//           flex: 1,
//           paddingHorizontal: 15,
//         }}>

//         {/* EMPLOYEE */}

//         <SingleDropdown
//           data={
//             employeeOptions
//           }
//           label="Select Employee"
//           value={
//             selectedEmployee
//           }
//           onChange={item =>
//             setSelectedEmployee(
//               item.value,
//             )
//           }
//           placeholder={
//             isLoding
//               ? 'Loading employees...'
//               : employeeOptions.length
//               ? 'Select Employee'
//               : 'No employees found'
//           }
//         />

//         {/* DATE */}

//         <Text
//           style={styles.label}>

//           Select Date

//         </Text>

//         <CalendarInput
//           value={
//             queryraiseddate
//           }
//           onChange={
//             setqueryraiseddate
//           }
//           placeholder="Select Date"
//           COLORS={COLORS.white}
//           style={{
//             backgroundColor:
//               isDark
//                 ? '#1C1C1E'
//                 : '#fff',

//             color: isDark
//               ? '#fff'
//               : '#0C1F3A',

//             fontSize: 16,

//             borderWidth: 1,

//             borderRadius: 6,

//             paddingHorizontal: 10,

//             paddingVertical: 12,
//           }}
//         />

//         {/* LOADING */}

//         {isRouteLoading && (
//           <Text
//             style={
//               styles.helperText
//             }>

//             Loading employee location...

//           </Text>
//         )}

//         {/* NO DATA */}

//         {!isRouteLoading &&
//           selectedEmployee &&
//           !routeCoordinates.length && (
//             <Text
//               style={
//                 styles.helperText
//               }>

//               No location found for this date.

//             </Text>
//           )}

//         {/* ======================
//             SUMMARY
//         ======================= */}

//         {!isRouteLoading &&
//           routeCoordinates.length >
//             0 && (
//             <View
//               style={
//                 styles.journeySummary
//               }>

//               <View
//                 style={
//                   styles.employeeSummary
//                 }>

//                 <Text
//                   style={
//                     styles.routeSummary
//                   }
//                   numberOfLines={1}>

//                   {routeData
//                     ?.employee_name
//                     ?.trim() ||
//                     'Employee'}

//                 </Text>

//                 <Text
//                   style={
//                     styles.routeMeta
//                   }>

//                   {
//                     routeCoordinates.length
//                   }{' '}
//                   GPS points •{' '}

//                   {totalDistance.toFixed(
//                     2,
//                   )}{' '}

//                   km

//                 </Text>

//                 {/* LIVE */}

//                 {queryraiseddate ===
//                   getTodayDate() &&
//                   latestLivePoint && (
//                     <View
//                       style={
//                         styles.liveStatusRow
//                       }>

//                       <View
//                         style={
//                           styles.liveStatusDot
//                         }
//                       />

//                       <Text
//                         style={
//                           styles.liveStatusText
//                         }>

//                         LIVE •{' '}

//                         {lastUpdatedAt
//                           ? lastUpdatedAt.toLocaleTimeString()
//                           : '--'}

//                       </Text>

//                     </View>
//                   )}

//               </View>

//               <TouchableOpacity
//                 activeOpacity={
//                   0.75
//                 }
//                 onPress={() =>
//                   setIsHistoryVisible(
//                     true,
//                   )
//                 }>

//                 <Text
//                   style={
//                     styles.locationText
//                   }>

//                   View history

//                 </Text>

//               </TouchableOpacity>

//             </View>
//           )}

//         {/* NO MOVEMENT */}

//         {!isRouteLoading &&
//           routeCoordinates.length >
//             1 &&
//           distinctRouteCoordinates.length ===
//             1 && (
//             <Text
//               style={
//                 styles.noMovementText
//               }>

//               Employee ki location abhi change nahi hui.

//             </Text>
//           )}

//         {/* ======================
//             MAP
//         ======================= */}

//         <View
//           style={
//             styles.mapContainer
//           }>

//           <MapView
//             ref={mapRef}
//             style={styles.map}
//             provider={
//               PROVIDER_GOOGLE
//             }
//             onMapReady={() =>
//               setIsMapReady(true)
//             }
//             onPress={
//               handleMapPress
//             }
//             initialRegion={{
//               latitude: 28.6139,

//               longitude: 77.209,

//               latitudeDelta: 0.1,

//               longitudeDelta: 0.1,
//             }}>

//             {/* ======================
//                 TRAVEL ROUTE
//             ======================= */}

//             {distinctRouteCoordinates.length >
//               1 && (
//               <>
//                 {/* WHITE OUTLINE */}

//                 <Polyline
//                   coordinates={
//                     distinctRouteCoordinates
//                   }
//                   strokeColor="#FFFFFF"
//                   strokeWidth={9}
//                   geodesic={
//                     false
//                   }
//                   zIndex={998}
//                   lineCap="round"
//                   lineJoin="round"
//                 />

//                 {/* BLUE ROUTE */}

//                 <Polyline
//                   coordinates={
//                     distinctRouteCoordinates
//                   }
//                   strokeColor="#176BFF"
//                   strokeWidth={6}
//                   geodesic={
//                     false
//                   }
//                   zIndex={999}
//                   lineCap="round"
//                   lineJoin="round"
//                 />
//               </>
//             )}

//             {/* ======================
//                 START MARKER
//             ======================= */}

//             {routeCoordinates.length >
//               0 && (
//               <Marker
//                 coordinate={
//                   routeCoordinates[0]
//                 }
//                 title="Start Location"
//                 description={
//                   routeCoordinates[0]
//                     .recordedAt ||
//                   'Starting point'
//                 }
//                 pinColor="green"
//                 zIndex={1000}
//               />
//             )}

//             {/* ======================
//                 HISTORICAL END MARKER
//             ======================= */}

//             {queryraiseddate !==
//               getTodayDate() &&
//               routeCoordinates.length >
//                 1 && (
//                 <Marker
//                   coordinate={
//                     routeCoordinates[
//                       routeCoordinates.length -
//                         1
//                     ]
//                   }
//                   title="Last Location"
//                   description={
//                     routeCoordinates[
//                       routeCoordinates.length -
//                         1
//                     ].recordedAt
//                   }
//                   pinColor="red"
//                   zIndex={1001}
//                 />
//               )}

//             {/* ======================
//                 LIVE EMPLOYEE MARKER
//             ======================= */}

//             {queryraiseddate ===
//               getTodayDate() &&
//               latestLivePoint && (

//               <Marker.Animated
//                 coordinate={
//                   liveMarkerCoordinate
//                 }
//                 title={`${
//                   routeData
//                     ?.employee_name
//                     ?.trim() ||
//                   'Employee'
//                 } • LIVE`}
//                 description={
//                   latestLivePoint.address ||
//                   'Current employee location'
//                 }
//                 anchor={{
//                   x: 0.5,
//                   y: 0.5,
//                 }}
//                 zIndex={2000}>

//                 <View
//                   style={
//                     styles.vehicleMarker
//                   }>

//                   <Ionicons
//                     name="navigate"
//                     size={23}
//                     color="#FFFFFF"
//                   />

//                 </View>

//               </Marker.Animated>
//             )}

//           </MapView>

//           {/* ======================
//               CURRENT LOCATION BUTTON
//           ======================= */}

//           {queryraiseddate ===
//             getTodayDate() &&
//             latestLivePoint && (

//             <TouchableOpacity
//               activeOpacity={
//                 0.8
//               }
//               style={
//                 styles.focusButton
//               }
//               onPress={
//                 focusCurrentEmployee
//               }>

//               <Ionicons
//                 name="locate"
//                 size={23}
//                 color="#176BFF"
//               />

//             </TouchableOpacity>
//           )}

//         </View>

//       </View>

//       {/* =====================================================
//           LOCATION DETAIL MODAL
//       ====================================================== */}

//       <Modal
//         transparent
//         visible={Boolean(
//           selectedPoint,
//         )}
//         animationType="slide"
//         statusBarTranslucent
//         hardwareAccelerated
//         presentationStyle="overFullScreen"
//         onRequestClose={() =>
//           setSelectedPoint(null)
//         }>

//         <Pressable
//           style={
//             styles.modalBackdrop
//           }
//           onPress={() =>
//             setSelectedPoint(null)
//           }>

//           <Pressable
//             style={
//               styles.bottomSheet
//             }
//             onPress={event =>
//               event.stopPropagation()
//             }>

//             <View
//               style={
//                 styles.sheetHandle
//               }
//             />

//             <View
//               style={
//                 styles.sheetHeader
//               }>

//               <View>

//                 <Text
//                   style={
//                     styles.sheetEyebrow
//                   }>

//                   LOCATION DETAILS

//                 </Text>

//                 <Text
//                   style={
//                     styles.sheetTitle
//                   }>

//                   Point{' '}

//                   {(selectedPoint?.index ??
//                     0) + 1}

//                 </Text>

//               </View>

//               <TouchableOpacity
//                 style={
//                   styles.closeButton
//                 }
//                 onPress={() =>
//                   setSelectedPoint(
//                     null,
//                   )
//                 }>

//                 <Text
//                   style={
//                     styles.closeButtonText
//                   }>

//                   ×

//                 </Text>

//               </TouchableOpacity>

//             </View>

//             {/* ADDRESS */}

//             <View
//               style={
//                 styles.addressCard
//               }>

//               <Text
//                 style={
//                   styles.detailLabel
//                 }>

//                 ADDRESS

//               </Text>

//               <Text
//                 style={
//                   styles.addressText
//                 }>

//                 {selectedPoint?.address ||
//                   'Address not available'}

//               </Text>

//             </View>

//             {/* LAT LONG */}

//             <View
//               style={
//                 styles.coordinateRow
//               }>

//               <View
//                 style={
//                   styles.coordinateCard
//                 }>

//                 <Text
//                   style={
//                     styles.detailLabel
//                   }>

//                   LATITUDE

//                 </Text>

//                 <Text
//                   style={
//                     styles.coordinateValue
//                   }>

//                   {selectedPoint?.latitude?.toFixed(
//                     7,
//                   ) ?? '--'}

//                 </Text>

//               </View>

//               <View
//                 style={
//                   styles.coordinateCard
//                 }>

//                 <Text
//                   style={
//                     styles.detailLabel
//                   }>

//                   LONGITUDE

//                 </Text>

//                 <Text
//                   style={
//                     styles.coordinateValue
//                   }>

//                   {selectedPoint?.longitude?.toFixed(
//                     7,
//                   ) ?? '--'}

//                 </Text>

//               </View>

//             </View>

//             {/* TIME */}

//             <View
//               style={
//                 styles.timeRow
//               }>

//               <Text
//                 style={
//                   styles.detailLabel
//                 }>

//                 RECORDED AT

//               </Text>

//               <Text
//                 style={
//                   styles.timeValue
//                 }>

//                 {selectedPoint?.recordedAt ||
//                   'Time not available'}

//               </Text>

//             </View>

//           </Pressable>

//         </Pressable>

//       </Modal>

//       {/* =====================================================
//           HISTORY MODAL
//       ====================================================== */}

//       <Modal
//         transparent
//         visible={
//           isHistoryVisible
//         }
//         animationType="slide"
//         statusBarTranslucent
//         hardwareAccelerated
//         presentationStyle="overFullScreen"
//         onRequestClose={() =>
//           setIsHistoryVisible(
//             false,
//           )
//         }>

//         <Pressable
//           style={
//             styles.modalBackdrop
//           }
//           onPress={() =>
//             setIsHistoryVisible(
//               false,
//             )
//           }>

//           <Pressable
//             style={[
//               styles.bottomSheet,
//               styles.historySheet,
//             ]}
//             onPress={event =>
//               event.stopPropagation()
//             }>

//             <View
//               style={
//                 styles.sheetHandle
//               }
//             />

//             <View
//               style={
//                 styles.sheetHeader
//               }>

//               <View
//                 style={
//                   styles.historyHeading
//                 }>

//                 <Text
//                   style={
//                     styles.sheetEyebrow
//                   }>

//                   FULL DAY JOURNEY

//                 </Text>

//                 <Text
//                   style={
//                     styles.sheetTitle
//                   }>

//                   Employee Locations

//                 </Text>

//                 <Text
//                   style={
//                     styles.historySubtitle
//                   }
//                   numberOfLines={1}>

//                   {routeData
//                     ?.employee_name
//                     ?.trim() ||
//                     'Employee'}

//                   {' • '}

//                   {queryraiseddate}

//                   {' • '}

//                   {
//                     routeCoordinates.length
//                   }{' '}

//                   hits

//                 </Text>

//               </View>

//               <TouchableOpacity
//                 style={
//                   styles.closeButton
//                 }
//                 onPress={() =>
//                   setIsHistoryVisible(
//                     false,
//                   )
//                 }>

//                 <Text
//                   style={
//                     styles.closeButtonText
//                   }>

//                   ×

//                 </Text>

//               </TouchableOpacity>

//             </View>

//             <ScrollView
//               showsVerticalScrollIndicator={
//                 false
//               }
//               contentContainerStyle={
//                 styles.historyList
//               }>

//               {routeCoordinates.map(
//                 (
//                   point,
//                   index,
//                 ) => (

//                   <TouchableOpacity
//                     key={
//                       point.pointId ??
//                       `history-${index}`
//                     }
//                     activeOpacity={
//                       0.8
//                     }
//                     style={
//                       styles.historyCard
//                     }
//                     onPress={() => {

//                       setIsHistoryVisible(
//                         false,
//                       );

//                       setSelectedPoint({
//                         ...point,
//                         index,
//                       });

//                       mapRef.current?.animateToRegion(
//                         {
//                           latitude:
//                             point.latitude,

//                           longitude:
//                             point.longitude,

//                           latitudeDelta:
//                             0.008,

//                           longitudeDelta:
//                             0.008,
//                         },

//                         450,
//                       );

//                     }}>

//                     <View
//                       style={
//                         styles.timelineColumn
//                       }>

//                       <View
//                         style={[
//                           styles.timelineDot,

//                           index ===
//                             0 &&
//                             styles.timelineDotStart,

//                           index ===
//                             routeCoordinates.length -
//                               1 &&
//                             styles.timelineDotEnd,
//                         ]}
//                       />

//                       {index <
//                         routeCoordinates.length -
//                           1 && (

//                         <View
//                           style={
//                             styles.timelineLine
//                           }
//                         />

//                       )}

//                     </View>

//                     <View
//                       style={
//                         styles.historyCardContent
//                       }>

//                       <View
//                         style={
//                           styles.historyCardHeader
//                         }>

//                         <Text
//                           style={
//                             styles.historyPointTitle
//                           }>

//                           Location{' '}
//                           {index + 1}

//                         </Text>

//                         <Text
//                           style={
//                             styles.historyTime
//                           }>

//                           {point.recordedAt ||
//                             '--'}

//                         </Text>

//                       </View>

//                       <Text
//                         style={
//                           styles.historyAddress
//                         }
//                         numberOfLines={
//                           2
//                         }>

//                         {point.address ||
//                           'Address not available'}

//                       </Text>

//                       <Text
//                         style={
//                           styles.historyCoordinates
//                         }>

//                         {point.latitude.toFixed(
//                           7,
//                         )}

//                         {', '}

//                         {point.longitude.toFixed(
//                           7,
//                         )}

//                       </Text>

//                     </View>

//                   </TouchableOpacity>

//                 ),
//               )}

//             </ScrollView>

//           </Pressable>

//         </Pressable>

//       </Modal>

//     </SafeAreaView>
//   );
// };

// export default MapsPreview;

// /* =========================================================
//    STYLES
// ========================================================= */

// const styles =
//   StyleSheet.create({

//     header: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       paddingHorizontal: 15,
//     },

//     backButton: {
//       width: 40,
//       justifyContent:
//         'center',
//       alignItems:
//         'flex-start',
//     },

//     titleContainer: {
//       flex: 1,
//       justifyContent:
//         'center',
//       alignItems:
//         'center',
//     },

//     title: {
//       fontSize: 18,
//       fontWeight: '600',
//     },

//     rightSpace: {
//       width: 40,
//     },

//     label: {
//       fontSize: 16,
//       fontWeight: '600',
//       color: '#0C1F3A',
//     },

//     helperText: {
//       marginTop: 10,
//       color: '#667085',
//       fontSize: 13,
//     },

//     journeySummary: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginTop: 10,
//     },

//     employeeSummary: {
//       flex: 1,
//     },

//     routeSummary: {
//       color: '#10233E',
//       fontSize: 14,
//       fontWeight: '800',
//     },

//     routeMeta: {
//       color: '#667085',
//       fontSize: 11,
//       marginTop: 3,
//     },

//     liveStatusRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginTop: 5,
//     },

//     liveStatusDot: {
//       width: 7,
//       height: 7,
//       borderRadius: 4,
//       backgroundColor:
//         '#22C55E',
//       marginRight: 6,
//     },

//     liveStatusText: {
//       color: '#16A34A',
//       fontSize: 10,
//       fontWeight: '800',
//     },

//     locationText: {
//       color: '#176BFF',
//       fontSize: 12,
//       fontWeight: '800',
//     },

//     noMovementText: {
//       marginTop: 6,
//       color: '#B54708',
//       fontSize: 12,
//       lineHeight: 17,
//     },

//     /* MAP */

//     mapContainer: {
//       flex: 1,
//       minHeight: 300,
//       marginTop: 14,
//       marginBottom: 10,
//       borderRadius: 14,
//       overflow: 'hidden',
//     },

//     map: {
//       ...StyleSheet.absoluteFillObject,
//     },

//     /* LIVE EMPLOYEE */

//     vehicleMarker: {
//       width: 46,
//       height: 46,
//       borderRadius: 23,

//       alignItems:
//         'center',

//       justifyContent:
//         'center',

//       backgroundColor:
//         '#176BFF',

//       borderWidth: 3,

//       borderColor:
//         '#FFFFFF',

//       shadowColor:
//         '#000000',

//       shadowOpacity:
//         0.3,

//       shadowRadius:
//         6,

//       shadowOffset: {
//         width: 0,
//         height: 3,
//       },

//       elevation: 9,
//     },

//     /* CURRENT LOCATION BUTTON */

//     focusButton: {
//       position: 'absolute',

//       right: 13,

//       bottom: 15,

//       width: 48,

//       height: 48,

//       borderRadius: 24,

//       backgroundColor:
//         '#FFFFFF',

//       alignItems:
//         'center',

//       justifyContent:
//         'center',

//       shadowColor:
//         '#000000',

//       shadowOpacity:
//         0.2,

//       shadowRadius:
//         6,

//       shadowOffset: {
//         width: 0,
//         height: 2,
//       },

//       elevation: 7,
//     },

//     /* MODAL */

//     modalBackdrop: {
//       flex: 1,

//       justifyContent:
//         'flex-end',

//       backgroundColor:
//         'rgba(4, 16, 31, 0.48)',
//     },

//     bottomSheet: {
//       backgroundColor:
//         '#FFFFFF',

//       borderTopLeftRadius:
//         28,

//       borderTopRightRadius:
//         28,

//       paddingHorizontal:
//         20,

//       paddingTop: 10,

//       paddingBottom: 30,
//     },

//     sheetHandle: {
//       alignSelf:
//         'center',

//       width: 42,

//       height: 5,

//       borderRadius: 3,

//       backgroundColor:
//         '#D7DEE8',

//       marginBottom: 18,
//     },

//     sheetHeader: {
//       flexDirection: 'row',

//       justifyContent:
//         'space-between',

//       alignItems:
//         'center',

//       marginBottom: 18,
//     },

//     sheetEyebrow: {
//       color: '#176BFF',

//       fontSize: 10,

//       fontWeight: '800',

//       letterSpacing: 1.1,
//     },

//     sheetTitle: {
//       color: '#10233E',

//       fontSize: 22,

//       fontWeight: '800',

//       marginTop: 3,
//     },

//     closeButton: {
//       width: 38,

//       height: 38,

//       borderRadius: 19,

//       alignItems:
//         'center',

//       justifyContent:
//         'center',

//       backgroundColor:
//         '#F1F5F9',
//     },

//     closeButtonText: {
//       color: '#334155',

//       fontSize: 26,

//       lineHeight: 28,
//     },

//     addressCard: {
//       padding: 16,

//       borderRadius: 18,

//       backgroundColor:
//         '#EEF4FF',

//       marginBottom: 12,
//     },

//     detailLabel: {
//       color: '#7B8CA4',

//       fontSize: 10,

//       fontWeight: '800',

//       letterSpacing: 0.8,
//     },

//     addressText: {
//       color: '#10233E',

//       fontSize: 15,

//       fontWeight: '600',

//       lineHeight: 22,

//       marginTop: 7,
//     },

//     coordinateRow: {
//       flexDirection: 'row',

//       gap: 10,
//     },

//     coordinateCard: {
//       flex: 1,

//       padding: 14,

//       borderRadius: 16,

//       backgroundColor:
//         '#F6F8FC',
//     },

//     coordinateValue: {
//       color: '#10233E',

//       fontSize: 14,

//       fontWeight: '800',

//       marginTop: 7,
//     },

//     timeRow: {
//       flexDirection: 'row',

//       alignItems:
//         'center',

//       justifyContent:
//         'space-between',

//       paddingHorizontal: 4,

//       marginTop: 18,
//     },

//     timeValue: {
//       color: '#334155',

//       fontSize: 13,

//       fontWeight: '700',
//     },

//     /* HISTORY */

//     historySheet: {
//       maxHeight: '82%',

//       paddingBottom: 18,
//     },

//     historyHeading: {
//       flex: 1,

//       paddingRight: 12,
//     },

//     historySubtitle: {
//       color: '#64748B',

//       fontSize: 12,

//       marginTop: 5,
//     },

//     historyList: {
//       paddingBottom: 12,
//     },

//     historyCard: {
//       flexDirection: 'row',

//       minHeight: 105,

//       backgroundColor:
//         '#F8FAFC',

//       borderRadius: 18,

//       padding: 14,

//       marginBottom: 10,
//     },

//     timelineColumn: {
//       width: 22,

//       alignItems:
//         'center',
//     },

//     timelineDot: {
//       width: 12,

//       height: 12,

//       borderRadius: 6,

//       backgroundColor:
//         '#176BFF',

//       borderWidth: 2,

//       borderColor:
//         '#DCE9FF',
//     },

//     timelineDotStart: {
//       backgroundColor:
//         '#16A34A',

//       borderColor:
//         '#DCFCE7',
//     },

//     timelineDotEnd: {
//       backgroundColor:
//         '#DC2626',

//       borderColor:
//         '#FEE2E2',
//     },

//     timelineLine: {
//       width: 2,

//       flex: 1,

//       backgroundColor:
//         '#C9DAF8',

//       marginTop: 4,
//     },

//     historyCardContent: {
//       flex: 1,

//       paddingLeft: 9,
//     },

//     historyCardHeader: {
//       flexDirection: 'row',

//       justifyContent:
//         'space-between',

//       alignItems:
//         'flex-start',

//       gap: 8,
//     },

//     historyPointTitle: {
//       color: '#10233E',

//       fontSize: 14,

//       fontWeight: '800',
//     },

//     historyTime: {
//       color: '#176BFF',

//       fontSize: 10,

//       fontWeight: '700',
//     },

//     historyAddress: {
//       color: '#526277',

//       fontSize: 12,

//       lineHeight: 17,

//       marginTop: 7,
//     },

//     historyCoordinates: {
//       color: '#8A97A8',

//       fontSize: 10,

//       fontWeight: '600',

//       marginTop: 7,
//     },
//   });

import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';

import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';

import {AuthContext} from '../Screens/Context';
import urls from '../../url';
import SingleDropdown from './SingleDropdown';
import CalendarInput from './CalendarInput';
import {COLORS} from '../styles/Colors';

import Ionicons from 'react-native-vector-icons/Ionicons';

import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  AnimatedRegion,
} from 'react-native-maps';

/* =========================================================
   TODAY DATE
========================================================= */

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/* =========================================================
   ROUTE DATA NORMALIZE
========================================================= */

const getRouteItems = data => {
  if (Array.isArray(data)) return data;

  const possibleRoutes = [
    data?.points,
    data?.route,
    data?.locations,
    data?.tracking_data,
    data?.coordinates,
    data?.data,
    data?.route?.points,
    data?.route?.locations,
  ];

  return possibleRoutes.find(Array.isArray) ?? (data ? [data] : []);
};

const normalizeCoordinate = item => {
  const latitude = Number(
    Array.isArray(item) ? item[0] : item?.latitude ?? item?.lat,
  );
  const longitude = Number(
    Array.isArray(item) ? item[1] : item?.longitude ?? item?.lng ?? item?.lon,
  );

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  return {
    latitude,
    longitude,
    recordedAt: item?.time_local ?? item?.time ?? item?.timestamp ?? null,
    address: item?.address ?? item?.location_name ?? '',
    pointId: item?.id ?? null,
  };
};

const sortPointsByTime = points =>
  [...points].sort((first, second) => {
    const firstTime = String(first?.time_local ?? first?.time ?? first?.timestamp ?? '');
    const secondTime = String(second?.time_local ?? second?.time ?? second?.timestamp ?? '');
    const timeComparison = firstTime.localeCompare(secondTime);
    if (timeComparison !== 0) return timeComparison;
    return Number(first?.id ?? 0) - Number(second?.id ?? 0);
  });

/* =========================================================
   DISTANCE + BEARING
========================================================= */

const toRadians = degrees => (degrees * Math.PI) / 180;
const toDegrees = radians => (radians * 180) / Math.PI;

const distanceInKm = (from, to) => {
  const earthRadiusKm = 6371;
  const latitudeDistance = toRadians(to.latitude - from.latitude);
  const longitudeDistance = toRadians(to.longitude - from.longitude);
  const value =
    Math.sin(latitudeDistance / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(longitudeDistance / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

// Direction (0-360) from point A to point B, used to rotate the live marker
const getBearing = (from, to) => {
  const dLon = toRadians(to.longitude - from.longitude);
  const y = Math.sin(dLon) * Math.cos(toRadians(to.latitude));
  const x =
    Math.cos(toRadians(from.latitude)) * Math.sin(toRadians(to.latitude)) -
    Math.sin(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.cos(dLon);
  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
};

const formatSecondsAgo = seconds => {
  if (seconds == null) return '--';
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
};

// Backend does not publish live-location updates more frequently than this.
const LIVE_REFRESH_INTERVAL_MS = 60 * 1000;

/* =========================================================
   MAIN COMPONENT
========================================================= */

const MapsPreview = ({navigation}) => {
  const mapRef = useRef(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;

  // Free, open-source routing engine — no API key / billing needed.
  // Public demo server has rate limits; for production/heavy usage,
  // self-host OSRM (or switch this URL to your own instance).
  const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

  const [isLoding, setIsLoading] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [queryraiseddate, setqueryraiseddate] = useState(getTodayDate);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(null);
  const [speedKmh, setSpeedKmh] = useState(0);

  // Road-snapped route (actual road path, not straight GPS-to-GPS lines)
  const [roadCoordinates, setRoadCoordinates] = useState([]);
  const [isRoadRouteLoading, setIsRoadRouteLoading] = useState(false);
  const [directionsError, setDirectionsError] = useState('');
  const [directionsDistance, setDirectionsDistance] = useState(0);

  // Journey playback — moves a marker point-by-point, pausing at each
  // GPS hit and showing its address, all the way to the last point.
  const [isPlaying, setIsPlaying] = useState(false);
  const [playIndex, setPlayIndex] = useState(0);
  const [playAddress, setPlayAddress] = useState('');
  const playStopRef = useRef(false);

  const playbackCoordinate = useRef(
    new AnimatedRegion({latitude: 28.6139, longitude: 77.209, latitudeDelta: 0, longitudeDelta: 0}),
  ).current;

  /* =========================
     LIVE MARKER
  ========================== */

  const previousLivePointRef = useRef(null);
  const previousFetchTimeRef = useRef(null);
  const rotationAnim = useRef(new Animated.Value(0)).current;

  const liveMarkerCoordinate = useRef(
    new AnimatedRegion({
      latitude: 28.6139,
      longitude: 77.209,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }),
  ).current;

  /* =========================================================
     ROUTE COORDINATES
  ========================================================= */

  const routeCoordinates = useMemo(
    () => sortPointsByTime(getRouteItems(routeData)).map(normalizeCoordinate).filter(Boolean),
    [routeData],
  );

  const distinctRouteCoordinates = useMemo(
    () =>
      routeCoordinates.filter(
        (point, index, points) =>
          index === 0 ||
          point.latitude !== points[index - 1].latitude ||
          point.longitude !== points[index - 1].longitude,
      ),
    [routeCoordinates],
  );

  const latestLivePoint =
    routeCoordinates.length > 0 ? routeCoordinates[routeCoordinates.length - 1] : null;

  const isLiveMode = queryraiseddate === getTodayDate();

  // Coordinates actually drawn on the map — road-snapped path when available,
  // falls back to the raw GPS points if there's only one point or no API key.
  const displayRouteCoordinates =
    distinctRouteCoordinates.length === 1 ? distinctRouteCoordinates : roadCoordinates;

  // Fetch road-snapped route from OSRM whenever the underlying GPS points
  // change (new employee, new date, or a fresh live-tracking ping)
  useEffect(() => {
    setRoadCoordinates([]);
    setDirectionsDistance(0);
    setDirectionsError('');

    if (distinctRouteCoordinates.length < 2) {
      setIsRoadRouteLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsRoadRouteLoading(true);

    const coordinatesParam = distinctRouteCoordinates
      .map(point => `${point.longitude},${point.latitude}`)
      .join(';');

    const requestUrl = `${OSRM_BASE_URL}/${coordinatesParam}?overview=full&geometries=geojson`;

    fetch(requestUrl, {signal: controller.signal})
      .then(res => res.json())
      .then(data => {
        if (data?.code !== 'Ok' || !data?.routes?.length) {
          throw new Error(data?.message || 'No route found');
        }

        const geometryCoords = data.routes[0].geometry.coordinates || [];

        // OSRM returns [longitude, latitude] — flip to react-native-maps format
        const snapped = geometryCoords.map(([longitude, latitude]) => ({
          latitude,
          longitude,
        }));

        setRoadCoordinates(snapped);
        setDirectionsDistance((data.routes[0].distance || 0) / 1000); // meters -> km
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setRoadCoordinates([]);
        setDirectionsError('Road route load nahi hui. Seedhi line dikha rahe hain.');
        console.warn('OSRM route error:', err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsRoadRouteLoading(false);
      });

    return () => controller.abort();
  }, [distinctRouteCoordinates]);

  const totalDistance = useMemo(() => {
    if (directionsDistance) return directionsDistance;

    let total = 0;
    for (let i = 1; i < displayRouteCoordinates.length; i++) {
      total += distanceInKm(displayRouteCoordinates[i - 1], displayRouteCoordinates[i]);
    }
    return total;
  }, [directionsDistance, displayRouteCoordinates]);

  /* =========================================================
     "X sec ago" ticker - updates every second
  ========================================================= */

  useEffect(() => {
    if (!isLiveMode) {
      setSecondsSinceUpdate(null);
      return;
    }

    const tick = setInterval(() => {
      if (lastUpdatedAt) {
        setSecondsSinceUpdate(Math.floor((Date.now() - lastUpdatedAt.getTime()) / 1000));
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [lastUpdatedAt, isLiveMode]);

  /* =========================================================
     EMPLOYEE LIST API
  ========================================================= */

  const fectchEmployeeList = async () => {
    try {
      setIsLoading(true);
      const apiUrl = `${server_origin}${urls.GETALLEMPLOYEES}`;

      const res = await axios.post(
        apiUrl,
        {jsonrpc: '2.0', method: 'call', params: {}},
        {headers: {'Content-Type': 'application/json'}, timeout: 15000},
      );

      const employees = res.data?.result?.employees ?? res.data?.employees ?? [];

      const options = employees
        .filter(employee => employee?.id != null && employee?.name?.trim())
        .map(employee => {
          const name = employee.name.trim();
          const employeeCode = employee.emp_code?.trim();
          return {
            label: employeeCode ? `${name} (${employeeCode})` : name,
            value: String(employee.id),
            employee,
          };
        });

      setEmployeeOptions(options);
    } catch (err) {
      setEmployeeOptions([]);
      console.log('Employee List Error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fectchEmployeeList();
  }, []);

  /* =========================================================
     EMPLOYEE ROUTE API
  ========================================================= */

  const fectchEmployeRoute = async (
    employeeId,
    date,
    signal,
    showLoading = true,
  ) => {
    try {
      if (showLoading) {
        setIsRouteLoading(true);
      }
      const apiUrl = `${server_origin}${urls.LIVELOCATIONROUTE}`;

      const res = await axios.post(
        apiUrl,
        {jsonrpc: '2.0', method: 'call', params: {employee_id: employeeId, date}},
        {headers: {'Content-Type': 'application/json'}, timeout: 15000, signal},
      );

      const nextRouteData = res.data?.result ?? res.data ?? null;
      // Keep the same state reference when polling returns unchanged data.
      // This prevents the route/map effects from resetting every minute.
      setRouteData(previousRouteData =>
        JSON.stringify(previousRouteData) === JSON.stringify(nextRouteData)
          ? previousRouteData
          : nextRouteData,
      );
    } catch (err) {
      if (axios.isCancel(err) || err.code === 'ERR_CANCELED') return;
      console.log('Route API Error:', err.message);
    } finally {
      if (showLoading && !signal?.aborted) {
        setIsRouteLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!selectedEmployee || !queryraiseddate) {
      setRouteData(null);
      return;
    }

    const controller = new AbortController();
    fectchEmployeRoute(selectedEmployee, queryraiseddate, controller.signal);
    return () => controller.abort();
  }, [selectedEmployee, queryraiseddate, server_origin]);

  /* =========================================================
     LIVE REFRESH — backend minimum interval ke saath aligned.
     Poll silently so the existing map remains visible.
  ========================================================= */

  useEffect(() => {
    if (!selectedEmployee || queryraiseddate !== getTodayDate()) return;

    const refreshTimer = setInterval(() => {
      // Background refresh: don't flash the page-level loading UI.
      fectchEmployeRoute(
        selectedEmployee,
        queryraiseddate,
        undefined,
        false,
      );
    }, LIVE_REFRESH_INTERVAL_MS);

    return () => clearInterval(refreshTimer);
  }, [selectedEmployee, queryraiseddate, server_origin]);

  /* =========================================================
     LIVE MARKER: SMOOTH MOVE + ROTATE + SPEED
  ========================================================= */

  useEffect(() => {
    if (!latestLivePoint) {
      previousLivePointRef.current = null;
      previousFetchTimeRef.current = null;
      return;
    }

    const previousPoint = previousLivePointRef.current;
    const now = Date.now();

    if (!previousPoint) {
      // first ever point — snap directly, no animation needed
      liveMarkerCoordinate.setValue({
        latitude: latestLivePoint.latitude,
        longitude: latestLivePoint.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0,
      });
    } else {
      const changed =
        previousPoint.latitude !== latestLivePoint.latitude ||
        previousPoint.longitude !== latestLivePoint.longitude;

      if (changed) {
        // speed = distance covered / actual real time gap since last update
        const timeDiffHours = previousFetchTimeRef.current
          ? (now - previousFetchTimeRef.current) / (1000 * 60 * 60)
          : null;

        const hopDistanceKm = distanceInKm(previousPoint, latestLivePoint);

        if (timeDiffHours && timeDiffHours > 0) {
          setSpeedKmh(hopDistanceKm / timeDiffHours);
        }

        // rotate marker towards direction of travel
        const bearing = getBearing(previousPoint, latestLivePoint);
        Animated.timing(rotationAnim, {
          toValue: bearing,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();

        // smoothly move the marker when a fresh coordinate arrives
        liveMarkerCoordinate
          .timing({
            latitude: latestLivePoint.latitude,
            longitude: latestLivePoint.longitude,
            duration: 8000,
            useNativeDriver: false,
          })
          .start();
      } else {
        // no movement, but keep speed honest
        setSpeedKmh(0);
      }
    }

    previousLivePointRef.current = latestLivePoint;
    previousFetchTimeRef.current = now;
    setLastUpdatedAt(new Date());
    setSecondsSinceUpdate(0);
  }, [latestLivePoint?.latitude, latestLivePoint?.longitude]);

  /* =========================================================
     AUTO FIT MAP
  ========================================================= */

  useEffect(() => {
    if (!isMapReady || !displayRouteCoordinates.length) return;

    const frame = requestAnimationFrame(() => {
      if (displayRouteCoordinates.length === 1) {
        mapRef.current?.animateToRegion(
          {...displayRouteCoordinates[0], latitudeDelta: 0.01, longitudeDelta: 0.01},
          500,
        );
      } else {
        mapRef.current?.fitToCoordinates(displayRouteCoordinates, {
          edgePadding: {top: 70, right: 50, bottom: 70, left: 50},
          animated: true,
        });
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [displayRouteCoordinates, isMapReady]);

  /* =========================================================
     POINT DETAILS / MAP PRESS
  ========================================================= */

  const openPointDetails = (point, index) => {
    setSelectedPoint({...point, index});
  };

  const handleMapPress = event => {
    if (!routeCoordinates.length) return;

    const pressedCoordinate = event.nativeEvent.coordinate;
    const nearestPoint = routeCoordinates.reduce(
      (nearest, point, index) => {
        const distance =
          Math.pow(point.latitude - pressedCoordinate.latitude, 2) +
          Math.pow(point.longitude - pressedCoordinate.longitude, 2);
        return distance < nearest.distance ? {point, index, distance} : nearest;
      },
      {point: routeCoordinates[0], index: 0, distance: Infinity},
    );

    openPointDetails(nearestPoint.point, nearestPoint.index);
  };

  const focusCurrentEmployee = () => {
    if (!latestLivePoint) return;
    mapRef.current?.animateToRegion(
      {latitude: latestLivePoint.latitude, longitude: latestLivePoint.longitude, latitudeDelta: 0.008, longitudeDelta: 0.008},
      500,
    );
  };

  // Sleep helper for the playback loop below
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  const playJourney = async () => {
    if (!routeCoordinates.length || isPlaying) return;

    playStopRef.current = false;
    setIsPlaying(true);

    for (let i = 0; i < routeCoordinates.length; i++) {
      if (playStopRef.current) break;

      const point = routeCoordinates[i];
      setPlayIndex(i);
      setPlayAddress(point.address || 'Address not available');

      if (i === 0) {
        // snap to the very first point instantly
        playbackCoordinate.setValue({
          latitude: point.latitude,
          longitude: point.longitude,
          latitudeDelta: 0,
          longitudeDelta: 0,
        });
      } else {
        const previousPoint = routeCoordinates[i - 1];
        const bearing = getBearing(previousPoint, point);

        Animated.timing(rotationAnim, {
          toValue: bearing,
          duration: 700,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();

        // travel to this point
        await new Promise(resolve => {
          playbackCoordinate
            .timing({
              latitude: point.latitude,
              longitude: point.longitude,
              duration: 1200,
              useNativeDriver: false,
            })
            .start(resolve);
        });
      }

      mapRef.current?.animateToRegion(
        {latitude: point.latitude, longitude: point.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01},
        600,
      );

      // pause at this hit so the address is readable before moving on
      if (i < routeCoordinates.length - 1) {
        await wait(1800);
      }
    }

    setIsPlaying(false);
    playStopRef.current = false;
  };

  const stopPlayback = () => {
    playStopRef.current = true;
    setIsPlaying(false);
  };

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <View style={{flex: 1, backgroundColor: isDark ? '#000' : '#fff',}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-circle-outline" size={18} color="#171717" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, {color: isDark ? '#fff' : '#0C1F3A'}]}>
            Live Location of Employee
          </Text>
        </View>

        <View style={styles.rightSpace} />
      </View>

      <View style={{flex: 1, paddingHorizontal: 15}}>
        <SingleDropdown
          data={employeeOptions}
          label="Select Employee"
          value={selectedEmployee}
          onChange={item => setSelectedEmployee(item.value)}
          placeholder={
            isLoding ? 'Loading employees...' : employeeOptions.length ? 'Select Employee' : 'No employees found'
          }
        />

        <Text style={styles.label}>Select Date</Text>

        <CalendarInput
          value={queryraiseddate}
          onChange={setqueryraiseddate}
          placeholder="Select Date"
          COLORS={COLORS.white}
          style={{
            backgroundColor: isDark ? '#1C1C1E' : '#fff',
            color: isDark ? '#fff' : '#0C1F3A',
            fontSize: 16,
            borderWidth: 1,
            borderRadius: 6,
            paddingHorizontal: 10,
            paddingVertical: 12,
          }}
        />

        {isRouteLoading && <Text style={styles.helperText}>Loading employee location...</Text>}

        {!isRouteLoading && isRoadRouteLoading && (
          <Text style={styles.helperText}>Finding driving route on roads...</Text>
        )}

        {!isRouteLoading && directionsError ? (
          <Text style={styles.routeErrorText}>{directionsError}</Text>
        ) : null}

        {!isRouteLoading && selectedEmployee && !routeCoordinates.length && (
          <Text style={styles.helperText}>No location found for this date.</Text>
        )}

        {!isRouteLoading && routeCoordinates.length > 0 && (
          <View style={styles.journeySummary}>
            <View style={styles.employeeSummary}>
              <Text style={styles.routeSummary} numberOfLines={1}>
                {routeData?.employee_name?.trim() || 'Employee'}
              </Text>

              <Text style={styles.routeMeta}>
                {routeCoordinates.length} GPS points • {totalDistance.toFixed(2)} km
              </Text>

              {/* {isLiveMode && latestLivePoint && (
                <View style={styles.liveStatusRow}>
                  <View style={styles.liveStatusDot} />
                  <Text style={styles.liveStatusText}>
                    LIVE • {formatSecondsAgo(secondsSinceUpdate)}
                  </Text>
                </View>
              )} */}
            </View>

            <View style={styles.summaryActions}>
              <TouchableOpacity activeOpacity={0.75} onPress={() => setIsHistoryVisible(true)}>
                <Text style={styles.locationText}>View history</Text>
              </TouchableOpacity>

              {routeCoordinates.length > 1 &&
                (isPlaying ? (
                  <TouchableOpacity activeOpacity={0.75} style={styles.playButton} onPress={stopPlayback}>
                    <Ionicons name="stop" size={13} color="#FFFFFF" />
                    <Text style={styles.playButtonText}>Stop</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity activeOpacity={0.75} style={styles.playButton} onPress={playJourney}>
                    <Ionicons name="play" size={13} color="#FFFFFF" />
                    <Text style={styles.playButtonText}>Play Journey</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        )}

        {!isRouteLoading && routeCoordinates.length > 1 && distinctRouteCoordinates.length === 1 && (
          <Text style={styles.noMovementText}>Employee ki location abhi change nahi hui.</Text>
        )}

        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            onMapReady={() => setIsMapReady(true)}
            onPress={handleMapPress}
            initialRegion={{latitude: 28.6139, longitude: 77.209, latitudeDelta: 0.1, longitudeDelta: 0.1}}>

            {displayRouteCoordinates.length > 1 && (
              <>
                <Polyline
                  coordinates={displayRouteCoordinates}
                  strokeColor="#FFFFFF"
                  strokeWidth={10}
                  geodesic={false}
                  zIndex={998}
                  lineCap="round"
                  lineJoin="round"
                />
                <Polyline
                  coordinates={displayRouteCoordinates}
                  strokeColor="#111111"
                  strokeWidth={6}
                  geodesic={false}
                  zIndex={999}
                  lineCap="round"
                  lineJoin="round"
                />
              </>
            )}

            {routeCoordinates.length > 0 && (
              <Marker
                coordinate={routeCoordinates[0]}
                title="Start Location"
                description={routeCoordinates[0].recordedAt || 'Starting point'}
                anchor={{x: 0.5, y: 0.5}}
                zIndex={1000}>
                <View style={styles.startMarker}>
                  <View style={styles.startMarkerCenter} />
                </View>
              </Marker>
            )}

            {!isLiveMode && routeCoordinates.length > 1 && (
              <Marker
                coordinate={routeCoordinates[routeCoordinates.length - 1]}
                title="Last Location"
                description={routeCoordinates[routeCoordinates.length - 1].recordedAt}
                anchor={{x: 0.5, y: 0.82}}
                zIndex={1001}>
                <View style={styles.destinationMarker}>
                  <Ionicons name="home" size={15} color="#171717" />
                </View>
              </Marker>
            )}

            {isPlaying && (
              <Marker.Animated coordinate={playbackCoordinate} anchor={{x: 0.5, y: 0.5}} zIndex={2500}>
                <View style={styles.playbackMarker}>
                  <Animated.View style={{transform: [{rotate: rotateInterpolate}]}}>
                    <Ionicons name="navigate" size={20} color="#FFFFFF" />
                  </Animated.View>
                </View>
              </Marker.Animated>
            )}

            {!isPlaying && isLiveMode && latestLivePoint && (
              <Marker.Animated
                coordinate={liveMarkerCoordinate}
                title={`${routeData?.employee_name?.trim() || 'Employee'} • LIVE`}
                description={latestLivePoint.address || 'Current employee location'}
                anchor={{x: 0.5, y: 0.5}}
                zIndex={2000}>
                <View style={styles.vehicleMarker}>
                  <Animated.View style={{transform: [{rotate: rotateInterpolate}]}}>
                    <Ionicons name="navigate" size={23} color="#FFFFFF" />
                  </Animated.View>
                </View>
              </Marker.Animated>
            )}
          </MapView>

          {isLiveMode && latestLivePoint && (
            <TouchableOpacity activeOpacity={0.8} style={styles.focusButton} onPress={focusCurrentEmployee}>
              <Ionicons name="locate" size={23} color="#176BFF" />
            </TouchableOpacity>
          )}

          {/* Zepto-style bottom stats card, only in live mode */}
          {!isPlaying && isLiveMode && latestLivePoint && (
            <View style={styles.liveStatsCard}>
              <View style={styles.liveStatsRow}>
                <View style={styles.liveStatItem}>
                  <Text style={styles.liveStatLabel}>Distance</Text>
                  <Text style={styles.liveStatValue}>{totalDistance.toFixed(2)} km</Text>
                </View>

                <View style={styles.liveStatDivider} />

                <View style={styles.liveStatItem}>
                  <Text style={styles.liveStatLabel}>Speed</Text>
                  <Text style={styles.liveStatValue}>{speedKmh.toFixed(0)} km/h</Text>
                </View>

                <View style={styles.liveStatDivider} />

                {/* <View style={styles.liveStatItem}>
                  <Text style={styles.liveStatLabel}>Updated</Text>
                  <Text style={styles.liveStatValue}>{formatSecondsAgo(secondsSinceUpdate)}</Text>
                </View> */}
              </View>
            </View>
          )}

          {/* Playback address card — shown while "Play Journey" is running */}
          {isPlaying && (
            <View style={styles.playbackCard}>
              <View style={styles.playbackCardHeader}>
                <Text style={styles.playbackStep}>
                  Point {playIndex + 1} of {routeCoordinates.length}
                </Text>
                <TouchableOpacity activeOpacity={0.75} onPress={stopPlayback}>
                  <Ionicons name="close-circle" size={20} color="#8A97A8" />
                </TouchableOpacity>
              </View>
              <Text style={styles.playbackAddress} numberOfLines={2}>
                {playAddress}
              </Text>
              <View style={styles.playbackProgressBg}>
                <View
                  style={[
                    styles.playbackProgressFill,
                    {width: `${((playIndex + 1) / routeCoordinates.length) * 100}%`},
                  ]}
                />
              </View>
            </View>
          )}
        </View>
      </View>

      {/* LOCATION DETAIL MODAL */}
      <Modal
        transparent
        visible={Boolean(selectedPoint)}
        animationType="slide"
        statusBarTranslucent
        hardwareAccelerated
        presentationStyle="overFullScreen"
        onRequestClose={() => setSelectedPoint(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setSelectedPoint(null)}>
          <Pressable style={styles.bottomSheet} onPress={event => event.stopPropagation()}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetEyebrow}>LOCATION DETAILS</Text>
                <Text style={styles.sheetTitle}>Point {(selectedPoint?.index ?? 0) + 1}</Text>
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedPoint(null)}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.addressCard}>
              <Text style={styles.detailLabel}>ADDRESS</Text>
              <Text style={styles.addressText}>{selectedPoint?.address || 'Address not available'}</Text>
            </View>

            <View style={styles.coordinateRow}>
              <View style={styles.coordinateCard}>
                <Text style={styles.detailLabel}>LATITUDE</Text>
                <Text style={styles.coordinateValue}>{selectedPoint?.latitude?.toFixed(7) ?? '--'}</Text>
              </View>

              <View style={styles.coordinateCard}>
                <Text style={styles.detailLabel}>LONGITUDE</Text>
                <Text style={styles.coordinateValue}>{selectedPoint?.longitude?.toFixed(7) ?? '--'}</Text>
              </View>
            </View>

            <View style={styles.timeRow}>
              <Text style={styles.detailLabel}>RECORDED AT</Text>
              <Text style={styles.timeValue}>{selectedPoint?.recordedAt || 'Time not available'}</Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* HISTORY MODAL */}
      <Modal
        transparent
        visible={isHistoryVisible}
        animationType="slide"
        statusBarTranslucent
        hardwareAccelerated
        presentationStyle="overFullScreen"
        onRequestClose={() => setIsHistoryVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setIsHistoryVisible(false)}>
          <Pressable style={[styles.bottomSheet, styles.historySheet]} onPress={event => event.stopPropagation()}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <View style={styles.historyHeading}>
                <Text style={styles.sheetEyebrow}>FULL DAY JOURNEY</Text>
                <Text style={styles.sheetTitle}>Employee Locations</Text>
                <Text style={styles.historySubtitle} numberOfLines={1}>
                  {routeData?.employee_name?.trim() || 'Employee'} • {queryraiseddate} • {routeCoordinates.length} hits
                </Text>
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={() => setIsHistoryVisible(false)}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.historyList}>
              {routeCoordinates.map((point, index) => (
                <TouchableOpacity
                  key={point.pointId ?? `history-${index}`}
                  activeOpacity={0.8}
                  style={styles.historyCard}
                  onPress={() => {
                    setIsHistoryVisible(false);
                    setSelectedPoint({...point, index});
                    mapRef.current?.animateToRegion(
                      {latitude: point.latitude, longitude: point.longitude, latitudeDelta: 0.008, longitudeDelta: 0.008},
                      450,
                    );
                  }}>
                  <View style={styles.timelineColumn}>
                    <View
                      style={[
                        styles.timelineDot,
                        index === 0 && styles.timelineDotStart,
                        index === routeCoordinates.length - 1 && styles.timelineDotEnd,
                      ]}
                    />
                    {index < routeCoordinates.length - 1 && <View style={styles.timelineLine} />}
                  </View>

                  <View style={styles.historyCardContent}>
                    <View style={styles.historyCardHeader}>
                      <Text style={styles.historyPointTitle}>Location {index + 1}</Text>
                      <Text style={styles.historyTime}>{point.recordedAt || '--'}</Text>
                    </View>

                    <Text style={styles.historyAddress} numberOfLines={2}>
                      {point.address || 'Address not available'}
                    </Text>

                    <Text style={styles.historyCoordinates}>
                      {point.latitude.toFixed(7)}, {point.longitude.toFixed(7)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default MapsPreview;

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15, 
    // paddingVertical: 8,
  },

  backButton: {
    minWidth: 72,
    height: 38,
    paddingHorizontal: 9,
    borderRadius: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFE36E',
    borderWidth: 1.5,
    borderColor: '#171717',
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  backButtonText: {color: '#171717', fontSize: 14, fontWeight: '800'},
  titleContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 18, fontWeight: '600'},
  rightSpace: {width: 72},
  label: {fontSize: 16, fontWeight: '600', color: '#0C1F3A'},
  helperText: {marginTop: 10, color: '#667085', fontSize: 13},
  routeErrorText: {color: '#DC2626', fontSize: 12, fontWeight: '700', marginTop: 6},

  journeySummary: {flexDirection: 'row', alignItems: 'center', marginTop: 10},
  employeeSummary: {flex: 1},
  routeSummary: {color: '#10233E', fontSize: 14, fontWeight: '800'},
  routeMeta: {color: '#667085', fontSize: 11, marginTop: 3},

  liveStatusRow: {flexDirection: 'row', alignItems: 'center', marginTop: 5},
  liveStatusDot: {width: 7, height: 7, borderRadius: 4, backgroundColor: '#22C55E', marginRight: 6},
  liveStatusText: {color: '#16A34A', fontSize: 10, fontWeight: '800'},

  locationText: {color: '#176BFF', fontSize: 12, fontWeight: '800'},
  noMovementText: {marginTop: 6, color: '#B54708', fontSize: 12, lineHeight: 17},

  summaryActions: {alignItems: 'flex-end', gap: 8},

  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 5,
  },
  playButtonText: {color: '#FFFFFF', fontSize: 11, fontWeight: '800'},

  playbackMarker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    elevation: 8,
  },

  playbackCard: {
    position: 'absolute',
    bottom: 15,
    left: 13,
    right: 13,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 8,
  },
  playbackCardHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  playbackStep: {color: '#4F46E5', fontSize: 11, fontWeight: '800'},
  playbackAddress: {color: '#10233E', fontSize: 14, fontWeight: '600', marginTop: 6, lineHeight: 19},
  playbackProgressBg: {height: 4, backgroundColor: '#EEF1F5', borderRadius: 2, marginTop: 10, overflow: 'hidden'},
  playbackProgressFill: {height: '100%', backgroundColor: '#4F46E5', borderRadius: 2},

  mapContainer: {flex: 1, minHeight: 300, marginTop: 14, marginBottom: 10, borderRadius: 14, overflow: 'hidden'},
  map: {...StyleSheet.absoluteFillObject},

  startMarker: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#111111',
    elevation: 5,
  },
  startMarkerCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#111111',
  },
  destinationMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE36E',
    borderWidth: 2,
    borderColor: '#171717',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 7,
  },

  vehicleMarker: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#176BFF',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
    elevation: 9,
  },

  focusButton: {
    position: 'absolute',
    right: 13,
    bottom: 100,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 7,
  },

  liveStatsCard: {
    position: 'absolute',
    bottom: 15,
    left: 13,
    right: 13,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 8,
  },

  liveStatsRow: {flexDirection: 'row', alignItems: 'center'},
  liveStatItem: {flex: 1, alignItems: 'center'},
  liveStatDivider: {width: 1, height: '100%', backgroundColor: '#EEF1F5'},
  liveStatLabel: {fontSize: 10, color: '#8A97A8', fontWeight: '600'},
  liveStatValue: {fontSize: 14, color: '#10233E', fontWeight: '800', marginTop: 4},

  modalBackdrop: {flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(4, 16, 31, 0.48)'},
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  sheetHandle: {alignSelf: 'center', width: 42, height: 5, borderRadius: 3, backgroundColor: '#D7DEE8', marginBottom: 18},
  sheetHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18},
  sheetEyebrow: {color: '#176BFF', fontSize: 10, fontWeight: '800', letterSpacing: 1.1},
  sheetTitle: {color: '#10233E', fontSize: 22, fontWeight: '800', marginTop: 3},
  closeButton: {width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9'},
  closeButtonText: {color: '#334155', fontSize: 26, lineHeight: 28},

  addressCard: {padding: 16, borderRadius: 18, backgroundColor: '#EEF4FF', marginBottom: 12},
  detailLabel: {color: '#7B8CA4', fontSize: 10, fontWeight: '800', letterSpacing: 0.8},
  addressText: {color: '#10233E', fontSize: 15, fontWeight: '600', lineHeight: 22, marginTop: 7},

  coordinateRow: {flexDirection: 'row', gap: 10},
  coordinateCard: {flex: 1, padding: 14, borderRadius: 16, backgroundColor: '#F6F8FC'},
  coordinateValue: {color: '#10233E', fontSize: 14, fontWeight: '800', marginTop: 7},

  timeRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, marginTop: 18},
  timeValue: {color: '#334155', fontSize: 13, fontWeight: '700'},

  historySheet: {maxHeight: '82%', paddingBottom: 18},
  historyHeading: {flex: 1, paddingRight: 12},
  historySubtitle: {color: '#64748B', fontSize: 12, marginTop: 5},
  historyList: {paddingBottom: 12},

  historyCard: {flexDirection: 'row', minHeight: 105, backgroundColor: '#F8FAFC', borderRadius: 18, padding: 14, marginBottom: 10},
  timelineColumn: {width: 22, alignItems: 'center'},
  timelineDot: {width: 12, height: 12, borderRadius: 6, backgroundColor: '#176BFF', borderWidth: 2, borderColor: '#DCE9FF'},
  timelineDotStart: {backgroundColor: '#16A34A', borderColor: '#DCFCE7'},
  timelineDotEnd: {backgroundColor: '#DC2626', borderColor: '#FEE2E2'},
  timelineLine: {width: 2, flex: 1, backgroundColor: '#C9DAF8', marginTop: 4},

  historyCardContent: {flex: 1, paddingLeft: 9},
  historyCardHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8},
  historyPointTitle: {color: '#10233E', fontSize: 14, fontWeight: '800'},
  historyTime: {color: '#176BFF', fontSize: 10, fontWeight: '700'},
  historyAddress: {color: '#526277', fontSize: 12, lineHeight: 17, marginTop: 7},
  historyCoordinates: {color: '#8A97A8', fontSize: 10, fontWeight: '600', marginTop: 7},
});
