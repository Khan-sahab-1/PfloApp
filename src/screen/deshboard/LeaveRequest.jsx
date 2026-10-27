

import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/Ionicons";
import { showMessage } from "react-native-flash-message";
import { AuthContext } from "../../Screens/Context";
import HeaderCompo from "../../components/HeaderCompo";
import Loader from "../../components/Loader";
import SingleDropdown from "../../components/SingleDropdown";
import TextinputCompo from "../../components/TextinputCompo";
import makeApiCall from "../../utils/apiHelper";
import urls from "../../../url";
import { COLORS } from "../../styles/Colors";

const ACCENT = COLORS.BLUE;
const timedTypes = ["Short Leave", "First Half", "Second Half"];

/* -------------------------------------------------------
   TimeStrip
   IMPORTANT:
   Keep this OUTSIDE LeaveRequestForm.
------------------------------------------------------- */
const TimeStrip = ({
  label,
  start,
  end,
  onChangeStart,
  onChangeEnd,
  colors,
}) => {
  if (!timedTypes.includes(label)) {
    return null;
  }

  return (
    <View
      style={[
        styles.timeEditor,
        {
          backgroundColor: colors.soft,
        },
      ]}
    >
      <View style={styles.timeHeader}>
        <Icon name="time-outline" size={18} color={ACCENT} />

        <Text
          style={[
            styles.timeTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Leave hours
        </Text>

        <Text
          style={[
            styles.timeLabel,
            {
              color: colors.muted,
            },
          ]}
        >
          {label}
        </Text>
      </View>

      <View style={styles.timeFields}>
        {/* FROM */}
        <View style={styles.timeField}>
          <Text
            style={[
              styles.timeCaption,
              {
                color: colors.muted,
              },
            ]}
          >
            FROM
          </Text>

          <TextinputCompo
            value={start}
            onChangeText={onChangeStart}
            placeholder="HH:MM"
            keyboardType="numbers-and-punctuation"
            maxLength={5}
            placeholderTextColor={colors.muted}
            style={[
              styles.timeInput,
              {
                color: colors.text,
                backgroundColor: colors.input,
                borderColor: colors.border,
              },
            ]}
          />
        </View>

        <Icon
          name="arrow-forward"
          size={18}
          color={colors.muted}
        />

        {/* TO */}
        <View style={styles.timeField}>
          <Text
            style={[
              styles.timeCaption,
              {
                color: colors.muted,
              },
            ]}
          >
            TO
          </Text>

          <TextinputCompo
            value={end}
            onChangeText={onChangeEnd}
            placeholder="HH:MM"
            keyboardType="numbers-and-punctuation"
            maxLength={5}
            placeholderTextColor={colors.muted}
            style={[
              styles.timeInput,
              {
                color: colors.text,
                backgroundColor: colors.input,
                borderColor: colors.border,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const LeaveRequestForm = ({ route, navigation }) => {
  const isDark = useColorScheme() === "dark";

  const routeParams = route?.params ?? {};

  const serverOrigin = useContext(AuthContext).currentUrl;

  const loginEmpCode = routeParams.employeeCode || "";

  const canDelegate =
    routeParams.isManager !== "hr.employee()" ||
    routeParams.leaveManager;

  const [employeeCode, setEmployeeCode] =
    useState(loginEmpCode);

  const [employeeName, setEmployeeName] =
    useState(routeParams.userName || "");

  const [forOther, setForOther] = useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [employees, setEmployees] = useState([]);

  const [description, setDescription] = useState("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [fromType, setFromType] = useState(null);

  const [toType, setToType] = useState(null);

  const [fromLabel, setFromLabel] = useState(null);

  const [toLabel, setToLabel] = useState(null);

  const [timeFrom, setTimeFrom] = useState("");

  const [timeTo, setTimeTo] = useState("");

  const [lastTimeFrom, setLastTimeFrom] = useState("");

  const [lastTimeTo, setLastTimeTo] = useState("");

  const [leaveTypes, setLeaveTypes] = useState([]);

  const [timing, setTiming] = useState({});

  const [calendarVisible, setCalendarVisible] =
    useState(false);

  const [calendarTarget, setCalendarTarget] =
    useState("from");

  const [loading, setLoading] = useState(false);

  const colors = isDark
    ? {
        bg: "#090E1A",
        card: "#121A2A",
        text: "#F8FAFC",
        muted: "#94A3B8",
        border: "#26344A",
        input: "#101827",
        soft: "#20254A",
      }
    : {
        bg: "#F5F7FB",
        card: "#FFFFFF",
        text: "#172033",
        muted: "#718096",
        border: "#E4E9F1",
        input: "#F9FAFC",
        soft: "#EEF2FF",
      };

  /* -------------------------------------------------------
     Time helpers
  ------------------------------------------------------- */

  const decimalTime = (value) => {
    if (
      value === "" ||
      value == null ||
      Number.isNaN(Number(value))
    ) {
      return "";
    }

    const hours = Math.floor(Number(value));

    const minutes = Math.round(
      (Number(value) - hours) * 60
    );

    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}`;
  };

  const shiftFrom =
    timing?.shift_timing?.[0]?.hour_from ?? "";

  const shiftTo =
    timing?.shift_timing?.[0]?.hour_to ?? "";

  /* -------------------------------------------------------
     FIX:
     Convert API values to Number before adding.

     WRONG:
     shiftFrom + shiftTo

     Example:
     "9" + "18" = "918"

     Correct:
     Number("9") + Number("18") = 27
  ------------------------------------------------------- */

  const half =
    shiftFrom !== "" && shiftTo !== ""
      ? (Number(shiftFrom) + Number(shiftTo)) / 2
      : "";

  const shortTimes = useMemo(() => {
    const limit = Number(
      timing?.shift_timing?.[0]?.hour_to ?? 19
    );

    const duration = Number(
      timing?.short_leave_time || 0
    );

    const now = new Date();

    const start = Math.min(
      now.getHours() + now.getMinutes() / 60,
      limit - duration
    );

    return {
      from: decimalTime(start),
      to: decimalTime(
        Math.min(start + duration, limit)
      ),
    };
  }, [timing]);

  /* -------------------------------------------------------
     Set first-day time
  ------------------------------------------------------- */

  useEffect(() => {
    if (fromLabel === "Short Leave") {
      setTimeFrom(shortTimes.from);
      setTimeTo(shortTimes.to);
    } else if (fromLabel === "First Half") {
      setTimeFrom(decimalTime(shiftFrom));
      setTimeTo(decimalTime(half));
    } else if (fromLabel === "Second Half") {
      setTimeFrom(decimalTime(half));
      setTimeTo(decimalTime(shiftTo));
    }
  }, [
    fromLabel,
    half,
    shiftFrom,
    shiftTo,
    shortTimes,
  ]);

  /* -------------------------------------------------------
     Set last-day time
  ------------------------------------------------------- */

  useEffect(() => {
    if (toLabel === "Short Leave") {
      setLastTimeFrom(shortTimes.from);
      setLastTimeTo(shortTimes.to);
    } else if (toLabel === "First Half") {
      setLastTimeFrom(decimalTime(shiftFrom));
      setLastTimeTo(decimalTime(half));
    } else if (toLabel === "Second Half") {
      setLastTimeFrom(decimalTime(half));
      setLastTimeTo(decimalTime(shiftTo));
    }
  }, [
    half,
    shiftFrom,
    shiftTo,
    shortTimes,
    toLabel,
  ]);

  /* -------------------------------------------------------
     Reset
  ------------------------------------------------------- */

  const resetLeaveSelection = () => {
    setFromType(null);
    setToType(null);

    setFromLabel(null);
    setToLabel(null);

    setTimeFrom("");
    setTimeTo("");

    setLastTimeFrom("");
    setLastTimeTo("");
  };

  /* -------------------------------------------------------
     Load leave types
  ------------------------------------------------------- */

  const loadLeaveTypes = async (code) => {
    const response = await makeApiCall(
      serverOrigin,
      urls.getLeaveFromTo,
      "POST",
      {
        jsonrpc: "2.0",
        method: "call",
        params: {
          employeeCode: code,
        },
      }
    );

    if (!response?.result) {
      throw new Error("Leave types are unavailable");
    }

    setTiming(response.result);

    setLeaveTypes(
      (response.result.leave_data || []).map(
        (item) => ({
          label: item.name,
          value: item.id,
        })
      )
    );
  };

  /* -------------------------------------------------------
     Delegate
  ------------------------------------------------------- */

  const handleDelegateChange = (value) => {
    setForOther(value);

    resetLeaveSelection();

    if (!value) {
      setSelectedEmployee(null);

      setEmployeeName(
        routeParams.userName || ""
      );

      setEmployeeCode(loginEmpCode);

      loadLeaveTypes(loginEmpCode).catch(() => {
        Alert.alert(
          "Unable to load form",
          "Self leave types could not be loaded."
        );
      });
    }
  };

  /* -------------------------------------------------------
     Employee change
  ------------------------------------------------------- */

  const handleEmployeeChange = (item) => {
    setSelectedEmployee(item.value);

    setEmployeeName(item.label);

    setEmployeeCode(item.value);

    resetLeaveSelection();

    loadLeaveTypes(item.value).catch(() => {
      Alert.alert(
        "Unable to load form",
        "Selected employee leave types could not be loaded."
      );
    });
  };

  /* -------------------------------------------------------
     Initial API load
  ------------------------------------------------------- */

  useEffect(() => {
    const load = async () => {
      try {
        const body = (code) => ({
          jsonrpc: "2.0",
          method: "call",
          params: {
            employeeCode: code,
          },
        });

        const [, employeeResponse] =
          await Promise.all([
            loadLeaveTypes(loginEmpCode),

            makeApiCall(
              serverOrigin,
              urls.getLeaveEmployee,
              "POST",
              body(loginEmpCode)
            ),
          ]);

        if (employeeResponse?.result) {
          setEmployees(
            employeeResponse.result.map(
              (emp) => ({
                label: emp.employee_name.trim(),
                value: emp.employee_code,
              })
            )
          );
        }
      } catch (error) {
        Alert.alert(
          "Unable to load form",
          "Please check your connection and try again."
        );
      }
    };

    load();
  }, [loginEmpCode, serverOrigin]);

  /* -------------------------------------------------------
     Date helpers
  ------------------------------------------------------- */

  const formatDate = (value) => {
    if (!value) return "";

    const [year, month, day] =
      value.split("-");

    const name = new Date(
      +year,
      +month - 1
    ).toLocaleString("en", {
      month: "short",
    });

    return `${day} ${name} ${year}`;
  };

  const dayCount = useMemo(
    () =>
      fromDate && toDate
        ? Math.max(
            1,
            Math.round(
              (new Date(toDate) -
                new Date(fromDate)) /
                86400000
            ) + 1
          )
        : 0,
    [fromDate, toDate]
  );

  const sameDay = Boolean(
    fromDate && fromDate === toDate
  );

  /* -------------------------------------------------------
     Time validation
  ------------------------------------------------------- */

  const isValidTime = (value) => {
    if (!/^\d{2}:\d{2}$/.test(value || "")) {
      return false;
    }

    const [hours, minutes] =
      value.split(":").map(Number);

    return (
      hours >= 0 &&
      hours <= 23 &&
      minutes >= 0 &&
      minutes <= 59
    );
  };

  /* -------------------------------------------------------
     Submit
  ------------------------------------------------------- */

  const submit = async () => {
    if (
      !employeeName ||
      !employeeCode ||
      !description.trim() ||
      !fromDate ||
      !toDate ||
      !fromType ||
      (!sameDay && !toType)
    ) {
      Alert.alert(
        "A few details are missing",
        "Please complete all required fields before submitting."
      );

      return;
    }

    if (
      new Date(toDate) <
      new Date(fromDate)
    ) {
      Alert.alert(
        "Invalid date range",
        "The end date cannot be before the start date."
      );

      return;
    }

    if (
      (timedTypes.includes(fromLabel) &&
        (!isValidTime(timeFrom) ||
          !isValidTime(timeTo))) ||
      (!sameDay &&
        timedTypes.includes(toLabel) &&
        (!isValidTime(lastTimeFrom) ||
          !isValidTime(lastTimeTo)))
    ) {
      Alert.alert(
        "Invalid time",
        "Please enter time in 24-hour HH:MM format."
      );

      return;
    }

    const firstFrom = timedTypes.includes(
      fromLabel
    )
      ? timeFrom
      : null;

    const firstTo = timedTypes.includes(
      fromLabel
    )
      ? timeTo
      : null;

    const lastFrom = timedTypes.includes(
      toLabel
    )
      ? lastTimeFrom
      : null;

    const lastTo = timedTypes.includes(
      toLabel
    )
      ? lastTimeTo
      : null;

    try {
      setLoading(true);

      const response = await makeApiCall(
        serverOrigin,
        urls.getLeave,
        "POST",
        {
          jsonrpc: "2.0",
          method: "call",
          params: {
            employeeName,
            employeeCode,
            description: description.trim(),
            fromDate,
            toDate,
            leaveType: null,
            leaveTypeFrom: fromLabel,
            leaveTypeTo: sameDay
              ? fromLabel
              : toLabel,
            timeFrom: firstFrom,
            timeTo: firstTo,
            time_from_down: sameDay
              ? firstFrom
              : lastFrom,
            time_to_down: sameDay
              ? firstTo
              : lastTo,
            selectedRestrictedLeaveID: "",
            loginEmpCode,
          },
        }
      );

      if (response?.result?.error) {
        showMessage({
          message: "Request not submitted",
          description: String(
            response.result.error
          ).replace(/[()']/g, ""),
          type: "danger",
        });
      } else if (response?.result) {
        showMessage({
          message: "Leave request sent",
          description:
            response.result.message ||
            "Your request is now awaiting approval.",
          type: "success",
        });

        setTimeout(
          () => navigation.goBack(),
          900
        );
      }
    } catch (error) {
      showMessage({
        message: "Something went wrong",
        description:
          "We could not submit your request. Please try again.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------
     Label
  ------------------------------------------------------- */


  const today = new Date();
const todayString = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0"),
].join("-");
  const Label = ({ children }) => (
    <Text
      style={[
        styles.label,
        {
          color: colors.text,
        },
      ]}
    >
      {children}
    </Text>
  );

  /* -------------------------------------------------------
     Date field
  ------------------------------------------------------- */

  const DateField = ({
    label,
    value,
    target,
  }) => (
    <View style={styles.flex}>
      <Label>{label}</Label>

      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => {
          setCalendarTarget(target);
          setCalendarVisible(true);
        }}
        style={[
          styles.dateInput,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.inputIcon,
            {
              backgroundColor: colors.soft,
            },
          ]}
        >
          <Icon
            name="calendar-outline"
            size={18}
            color={ACCENT}
          />
        </View>

        <View style={styles.flex}>
          <Text
            style={[
              styles.dateValue,
              {
                color: value
                  ? colors.text
                  : colors.muted,
              },
            ]}
          >
            {value
              ? formatDate(value)
              : "Select date"}
          </Text>

          <Text
            style={[
              styles.dateHint,
              {
                color: colors.muted,
              },
            ]}
          >
            {target === "from"
              ? "Leave begins"
              : "Leave ends"}
          </Text>
        </View>

        <Icon
          name="chevron-down"
          size={16}
          color={colors.muted}
        />
      </TouchableOpacity>
    </View>
  );

  /* -------------------------------------------------------
     Section header
  ------------------------------------------------------- */

  const SectionHead = ({
    icon,
    title,
    subtitle,
  }) => (
    <View style={styles.sectionHead}>
      <View
        style={[
          styles.sectionIcon,
          {
            backgroundColor: colors.soft,
          },
        ]}
      >
        <Icon
          name={icon}
          size={19}
          color={ACCENT}
        />
      </View>

      <View>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.sectionSubtitle,
            {
              color: colors.muted,
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.bg,
        },
      ]}
    >
      <HeaderCompo
        title="Request Leave"
        lefticon={require("../../assets/back.png")}
        onPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.screen}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* -------------------------------------------------------
              Delegate
          ------------------------------------------------------- */}

          {canDelegate && (
            <View
              style={[
                styles.delegate,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.delegateIcon,
                  {
                    backgroundColor:
                      colors.soft,
                  },
                ]}
              >
                <Icon
                  name="people-outline"
                  size={21}
                  color={ACCENT}
                />
              </View>

              <View style={styles.flex}>
                <Text
                  style={[
                    styles.delegateTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Request for someone else
                </Text>

                <Text
                  style={[
                    styles.delegateSub,
                    {
                      color: colors.muted,
                    },
                  ]}
                >
                  Create leave for a team member
                </Text>
              </View>

              <Switch
                value={forOther}
                onValueChange={
                  handleDelegateChange
                }
                trackColor={{
                  false: "#CBD5E1",
                  true: "#A5B4FC",
                }}
                thumbColor={
                  forOther
                    ? ACCENT
                    : "#F8FAFC"
                }
              />
            </View>
          )}

          {/* -------------------------------------------------------
              Employee
          ------------------------------------------------------- */}

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <SectionHead
              icon="person-outline"
              title="Employee"
              subtitle="Who is this request for?"
            />

            {forOther ? (
              <>
                <Label>
                  Team member *
                </Label>

                <SingleDropdown
                  data={employees}
                  value={selectedEmployee}
                  onChange={
                    handleEmployeeChange
                  }
                  placeholder="Search employee"
                  style={[
                    styles.dropdown,
                    {
                      backgroundColor:
                        colors.input,
                      borderColor:
                        colors.border,
                    },
                  ]}
                />
              </>
            ) : (
              <View
                style={[
                  styles.profile,
                  {
                    backgroundColor:
                      colors.input,
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <View style={styles.avatar}>
                  <Text
                    style={styles.avatarText}
                  >
                    {(employeeName || "E")
                      .trim()[0]
                      .toUpperCase()}
                  </Text>
                </View>

                <View style={styles.flex}>
                  <Text
                    style={[
                      styles.profileName,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {employeeName ||
                      "Employee"}
                  </Text>

                  <Text
                    style={[
                      styles.profileCode,
                      {
                        color:
                          colors.muted,
                      },
                    ]}
                  >
                    Employee ID •{" "}
                    {employeeCode || "—"}
                  </Text>
                </View>

                <View
                  style={styles.youBadge}
                >
                  <Icon
                    name="checkmark-circle"
                    size={16}
                    color="#16A34A"
                  />

                  <Text
                    style={styles.youText}
                  >
                    You
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* -------------------------------------------------------
              Leave duration
          ------------------------------------------------------- */}

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <SectionHead
              icon="calendar-clear-outline"
              title="Leave duration"
              subtitle="Choose your dates and leave type"
            />

            <View style={styles.dateRow}>
              <DateField
                label="From *"
                value={fromDate}
                target="from"
              />

              <DateField
                label="To *"
                value={toDate}
                target="to"
              />
            </View>

            {dayCount > 0 && (
              <View
                style={[
                  styles.duration,
                  {
                    backgroundColor:
                      colors.soft,
                  },
                ]}
              >
                <Icon
                  name="sparkles-outline"
                  size={15}
                  color={ACCENT}
                />

                <Text
                  style={styles.durationText}
                >
                  {dayCount}{" "}
                  {dayCount === 1
                    ? "calendar day"
                    : "calendar days"}{" "}
                  selected
                </Text>
              </View>
            )}

            <Label>
              Starting day leave type *
            </Label>

            <SingleDropdown
              data={leaveTypes}
              value={fromType}
              onChange={(item) => {
                setFromType(item.value);
                setFromLabel(item.label);

                if (!toType) {
                  setToType(item.value);
                  setToLabel(item.label);
                }
              }}
              placeholder="Choose leave type"
              style={[
                styles.dropdown,
                {
                  backgroundColor:
                    colors.input,
                  borderColor:
                    colors.border,
                },
              ]}
            />

            {/* -------------------------------------------------------
                FIRST DAY TIME

                IMPORTANT:
                TimeStrip is now OUTSIDE the parent component.
            ------------------------------------------------------- */}

            <TimeStrip
              label={fromLabel}
              start={timeFrom}
              end={timeTo}
              onChangeStart={setTimeFrom}
              onChangeEnd={setTimeTo}
              colors={colors}
            />

            {!sameDay &&
              fromDate &&
              toDate && (
                <>
                  <Label>
                    Ending day leave type *
                  </Label>

                  <SingleDropdown
                    data={leaveTypes}
                    value={toType}
                    onChange={(item) => {
                      setToType(item.value);
                      setToLabel(item.label);
                    }}
                    placeholder="Choose leave type"
                    style={[
                      styles.dropdown,
                      {
                        backgroundColor:
                          colors.input,
                        borderColor:
                          colors.border,
                      },
                    ]}
                  />

                  {/* -------------------------------------------------------
                      LAST DAY TIME
                  ------------------------------------------------------- */}

                  <TimeStrip
                    label={toLabel}
                    start={lastTimeFrom}
                    end={lastTimeTo}
                    onChangeStart={
                      setLastTimeFrom
                    }
                    onChangeEnd={
                      setLastTimeTo
                    }
                    colors={colors}
                  />
                </>
              )}
          </View>

          {/* -------------------------------------------------------
              Reason
          ------------------------------------------------------- */}

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <SectionHead
              icon="document-text-outline"
              title="Reason"
              subtitle="A short note helps your approver"
            />

            <TextinputCompo
              placeholder="e.g. Family event, personal appointment..."
              multiline
              numberOfLines={4}
              maxLength={300}
              value={description}
              onChangeText={setDescription}
              autoCapitalize="sentences"
              placeholderTextColor={
                colors.muted
              }
              style={[
                styles.reason,
                {
                  color: colors.text,
                  backgroundColor:
                    colors.input,
                  borderColor:
                    colors.border,
                },
              ]}
            />

            <Text
              style={[
                styles.counter,
                {
                  color: colors.muted,
                },
              ]}
            >
              {description.length}/300
            </Text>
          </View>

          {/* -------------------------------------------------------
              Submit
          ------------------------------------------------------- */}

          <TouchableOpacity
            activeOpacity={0.86}
            onPress={submit}
            disabled={loading}
            style={[
              styles.submit,
              loading && styles.disabled,
            ]}
          >
            <Text
              style={styles.submitText}
            >
              {loading
                ? "Submitting…"
                : "Submit leave request"}
            </Text>

            {!loading && (
              <View style={styles.arrow}>
                <Icon
                  name="arrow-forward"
                  size={18}
                  color={ACCENT}
                />
              </View>
            )}
          </TouchableOpacity>

          <Text
            style={[
              styles.note,
              {
                color: colors.muted,
              },
            ]}
          >
            <Icon
              name="shield-checkmark-outline"
              size={13}
              color={colors.muted}
            />{" "}
            Your manager will be notified after
            submission
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* -------------------------------------------------------
          Calendar Modal
      ------------------------------------------------------- */}

      <Modal
        visible={calendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setCalendarVisible(false)
        }
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() =>
              setCalendarVisible(false)
            }
          />

          <View
            style={[
              styles.calendarModal,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
          >
            <View style={styles.handle} />

            <View style={styles.modalHead}>
              <View>
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Select{" "}
                  {calendarTarget ===
                  "from"
                    ? "start"
                    : "end"}{" "}
                  date
                </Text>

                <Text
                  style={[
                    styles.modalSub,
                    {
                      color:
                        colors.muted,
                    },
                  ]}
                >
                  Tap a day to continue
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.close,
                  {
                    backgroundColor:
                      colors.input,
                  },
                ]}
                onPress={() =>
                  setCalendarVisible(
                    false
                  )
                }
              >
                <Icon
                  name="close"
                  size={21}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            <Calendar
              // minDate={
              //   calendarTarget === "to" &&
              //   fromDate
              //     ? fromDate
              //     : todayString
              // }
               minDate={
    calendarTarget === "to" && fromDate
      ? (fromDate > todayString ? fromDate : todayString)
      : todayString
  }
              onDayPress={(day) => {
                if (
                  calendarTarget ===
                  "from"
                ) {
                  setFromDate(
                    day.dateString
                  );

                  if (
                    !toDate ||
                    new Date(toDate) <
                      new Date(
                        day.dateString
                      )
                  ) {
                    setToDate(
                      day.dateString
                    );
                  }
                } else {
                  setToDate(
                    day.dateString
                  );
                }

                setCalendarVisible(
                  false
                );
              }}
              markedDates={{
                ...(fromDate
                  ? {
                      [fromDate]: {
                        selected: true,
                        selectedColor:
                          ACCENT,
                      },
                    }
                  : {}),

                ...(toDate
                  ? {
                      [toDate]: {
                        selected: true,
                        selectedColor:
                          ACCENT,
                      },
                    }
                  : {}),
              }}
              theme={{
                calendarBackground:
                  colors.card,
                dayTextColor:
                  colors.text,
                monthTextColor:
                  colors.text,
                arrowColor: ACCENT,
                textDisabledColor:
                  colors.border,
                textSectionTitleColor:
                  colors.muted,
                todayTextColor:
                  ACCENT,
                textMonthFontWeight:
                  "700",
              }}
            />
          </View>
        </View>
      </Modal>

      <Loader visible={loading} />
    </View>
  );
};

export default LeaveRequestForm;

/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  flex: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  hero: {
    backgroundColor: ACCENT,
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: ACCENT,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 7,
  },

  orbOne: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor:
      "rgba(255,255,255,.08)",
    right: -38,
    top: -65,
  },

  orbTwo: {
    position: "absolute",
    width: 95,
    height: 95,
    borderRadius: 50,
    backgroundColor:
      "rgba(255,255,255,.06)",
    left: -35,
    bottom: -50,
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor:
      "rgba(255,255,255,.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  eyebrow: {
    fontSize: 10,
    letterSpacing: 1.8,
    color: "#C7D2FE",
    fontWeight: "800",
  },

  heroTitle: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "800",
    marginTop: 2,
  },

  heroSub: {
    fontSize: 13,
    lineHeight: 19,
    color: "#E0E7FF",
    marginTop: 4,
  },

  steps: {
    flexDirection: "row",
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth:
      StyleSheet.hairlineWidth,
    borderTopColor:
      "rgba(255,255,255,.22)",
  },

  step: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,.45)",
    marginRight: 7,
    alignItems: "center",
    justifyContent: "center",
  },

  activeDot: {
    backgroundColor: "#FFF",
    borderColor: "#FFF",
  },

  stepText: {
    fontSize: 11,
    color: "#C7D2FE",
    fontWeight: "600",
  },

  activeStep: {
    color: "#FFF",
    fontWeight: "800",
  },

  delegate: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },

  delegateIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  delegateTitle: {
    fontSize: 14,
    fontWeight: "700",
  },

  delegateSub: {
    fontSize: 11,
    marginTop: 3,
  },

  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 17,
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },

  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  sectionSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },

  profile: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  avatarText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFF",
  },

  profileName: {
    fontSize: 15,
    fontWeight: "700",
  },

  profileCode: {
    fontSize: 11,
    marginTop: 4,
  },

  youBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF3",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
  },

  youText: {
    fontSize: 10,
    color: "#15803D",
    fontWeight: "700",
    marginLeft: 3,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 7,
  },

  dateRow: {
    flexDirection: "row",
    gap: 10,
  },

  dateInput: {
    height: 67,
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
  },

  inputIcon: {
    width: 33,
    height: 33,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },

  dateValue: {
    fontSize: 11,
    fontWeight: "700",
  },

  dateHint: {
    fontSize: 9,
    marginTop: 3,
  },

  duration: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 99,
    marginVertical: 14,
  },

  durationText: {
    color: ACCENT,
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 5,
  },

  dropdown: {
    height: 54,
    borderRadius: 14,
    paddingHorizontal: 13,
  },

  /* -------------------------------------------------------
     Time input styles
  ------------------------------------------------------- */

  timeEditor: {
    borderRadius: 15,
    padding: 12,
    marginBottom: 14,
  },

  timeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  timeTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 6,
  },

  timeLabel: {
    fontSize: 10,
    marginLeft: "auto",
  },

  timeFields: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  timeField: {
    flex: 1,
  },

  timeCaption: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 5,
  },

  timeInput: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: "700",
  },

  /* -------------------------------------------------------
     Reason
  ------------------------------------------------------- */

  reason: {
    height: 112,
    borderRadius: 15,
    padding: 13,
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: "top",
  },

  counter: {
    fontSize: 10,
    textAlign: "right",
    marginTop: 6,
  },

  /* -------------------------------------------------------
     Submit
  ------------------------------------------------------- */

  submit: {
    height: 58,
    borderRadius: 18,
    backgroundColor: ACCENT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    shadowColor: ACCENT,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  submitText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "800",
  },

  arrow: {
    position: "absolute",
    right: 9,
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },

  disabled: {
    opacity: 0.65,
  },

  note: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 13,
  },

  /* -------------------------------------------------------
     Calendar
  ------------------------------------------------------- */

  overlay: {
    flex: 1,
    backgroundColor:
      "rgba(3,7,18,.68)",
    justifyContent: "flex-end",
  },

  calendarModal: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom:
      Platform.OS === "ios" ? 36 : 24,
  },

  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 18,
  },

  modalHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: "800",
  },

  modalSub: {
    fontSize: 11,
    marginTop: 3,
  },

  close: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});