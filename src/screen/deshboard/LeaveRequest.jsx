// import React, {useContext, useEffect, useMemo, useState} from 'react';
// import {Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, useColorScheme, View} from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {Calendar} from 'react-native-calendars';
// import {showMessage} from 'react-native-flash-message';
// import {AuthContext} from '../../Screens/Context';
// import TextinputCompo from '../../components/TextinputCompo';
// import SingleDropdown from '../../components/SingleDropdown';
// import Loader from '../../components/Loader';
// import makeApiCall from '../../utils/apiHelper';
// import urls from '../../../url';

// const BLUE = '#2563EB', NAVY = '#071B35', MUTED = '#64748B', BORDER = '#E2E8F0';
// const Label = ({children}) => <Text style={s.label}>{children} <Text style={s.req}>*</Text></Text>;

// const LeaveRequestForm = ({route, navigation}) => {
//   const p = route?.params || {};
//   const dark = useColorScheme() === 'dark';
//   const origin = useContext(AuthContext).currentUrl;
//   const loginCode = p.employeeCode || '';
//   const [code, setCode] = useState(loginCode), [name, setName] = useState(p.userName || '');
//   const [other, setOther] = useState(false), [loading, setLoading] = useState(false);
//   const [reason, setReason] = useState(''), [from, setFrom] = useState(''), [to, setTo] = useState('');
//   const [fromId, setFromId] = useState(null), [toId, setToId] = useState(null);
//   const [fromType, setFromType] = useState(null), [toType, setToType] = useState(null);
//   const [timeFrom, setTimeFrom] = useState(''), [timeTo, setTimeTo] = useState('');
//   const [types, setTypes] = useState([]), [employees, setEmployees] = useState([]), [employee, setEmployee] = useState(null);
//   const [timing, setTiming] = useState({}), [calendar, setCalendar] = useState(false), [target, setTarget] = useState('from');
//   const canChoose = p.isManager !== 'hr.employee()' || p.leaveManager;
//   const sameDay = !!from && from === to;
//   const decimalTime = n => {
//     if (n === '' || !Number.isFinite(Number(n))) {return '';}
//     const h = Math.floor(Number(n)), m = Math.round((Number(n) - h) * 60);
//     return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
//   };
//   const shiftFrom = timing?.shift_timing?.[0]?.hour_from ?? '';
//   const shiftTo = timing?.shift_timing?.[0]?.hour_to ?? '';
//   const half = decimalTime((Number(shiftFrom) + Number(shiftTo)) / 2);
//   const now = new Date(), duration = Number(timing?.short_leave_time) || 0;
//   const shortStart = Math.min(now.getHours() + now.getMinutes() / 60, Math.max(0, (Number(shiftTo) || 19) - duration));
//   useEffect(() => { if (fromType === 'Short Leave') { setTimeFrom(decimalTime(shortStart)); setTimeTo(decimalTime(shortStart + duration)); } }, [fromType, shortStart, duration]);

//   const loadTypes = async employeeCode => {
//     try {
//       const r = await makeApiCall(origin, urls.getLeaveFromTo, 'POST', {jsonrpc:'2.0', method:'call', params:{employeeCode}});
//       if (!r?.result) {throw Error();}
//       setTiming(r.result); setTypes((r.result.leave_data || []).map(x => ({label:x.name, value:x.id})));
//     } catch { Alert.alert('Unable to load', 'Leave types could not be loaded.'); }
//   };
//   const loadEmployees = async () => {
//     try {
//       const r = await makeApiCall(origin, urls.getLeaveEmployee, 'POST', {jsonrpc:'2.0', method:'call', params:{employeeCode:loginCode}});
//       if (!r?.result) {throw Error();}
//       setEmployees(r.result.map(x => ({label:x.employee_name.trim(), value:x.employee_code})));
//     } catch { Alert.alert('Unable to load', 'Employee list could not be loaded.'); }
//   };
//   useEffect(() => { loadTypes(loginCode); loadEmployees(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   const displayDate = d => d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : 'Select date';
//   const dayCount = useMemo(() => from && to ? Math.round((new Date(`${to}T00:00:00`) - new Date(`${from}T00:00:00`)) / 86400000) + 1 : 0, [from,to]);
//   const times = (type, last = false) => {
//     if (type === 'Short Leave') {return last ? {a:decimalTime(shortStart),b:decimalTime(shortStart + duration)} : {a:timeFrom,b:timeTo,edit:true};}
//     if (type === 'First Half') {return {a:decimalTime(shiftFrom),b:half};}
//     if (type === 'Second Half') {return {a:half,b:decimalTime(shiftTo)};}
//     return {};
//   };
//   const TimeBox = ({type,last}) => {
//     const t = times(type,last); if (!t.a && !t.b) {return null;}
//     return <View style={s.timeBox}><View style={s.timeTitle}><Ionicons name="time-outline" size={17} color={BLUE}/><Text style={s.timeTitleText}>Leave hours</Text></View><View style={s.timeRow}>
//       <View style={s.timeCol}><Text style={s.mini}>FROM</Text><TextinputCompo style={s.timeInput} value={t.a} editable={!!t.edit} onChangeText={setTimeFrom}/></View>
//       <Ionicons name="arrow-forward" size={18} color="#94A3B8"/><View style={s.timeCol}><Text style={s.mini}>TO</Text><TextinputCompo style={s.timeInput} value={t.b} editable={!!t.edit} onChangeText={setTimeTo}/></View>
//     </View></View>;
//   };
//   const chooseDate = d => {
//     if (target === 'from') { setFrom(d); if (!to || d > to) {setTo(d);} }
//     else if (from && d < from) { setFrom(d); setTo(d); } else {setTo(d);}
//     setCalendar(false);
//   };
//   const submit = async () => {
//     if (!name || !code || !reason.trim() || !from || !to || !fromId || !toId) {return Alert.alert('Almost there','Please complete all required fields.');}
//     if (to < from) {return Alert.alert('Check your dates','End date cannot be before start date.');}
//     const a = times(fromType), b = times(toType,true);
//     const params = {employeeName:name,employeeCode:code,description:reason.trim(),fromDate:from,toDate:to,leaveType:null,leaveTypeFrom:fromType,leaveTypeTo:toType,timeFrom:a.a || null,timeTo:a.b || null,time_from_down:sameDay ? a.a || null : b.a || null,time_to_down:sameDay ? a.b || null : b.b || null,selectedRestrictedLeaveID:'',loginEmpCode:loginCode};
//     try {
//       setLoading(true); const r = await makeApiCall(origin,urls.getLeave,'POST',{jsonrpc:'2.0',method:'call',params});
//       if(r?.result?.error) {showMessage({message:'Request not submitted',description:String(r.result.error).replace(/[()']/g,''),type:'danger'});}
//       else if(r?.result){showMessage({message:'Leave request submitted',description:r.result.message || 'Your manager will be notified.',type:'success'}); setTimeout(()=>navigation.goBack(),900);}
//     } catch { showMessage({message:'Request failed',description:'Check your connection and try again.',type:'danger'}); } finally {setLoading(false);}
//   };
//   const Section = ({number,title,hint,children})=><View style={s.card}><View style={s.sectionHead}><View style={s.step}><Text style={s.stepText}>{number}</Text></View><View><Text style={s.sectionTitle}>{title}</Text><Text style={s.sectionHint}>{hint}</Text></View></View>{children}</View>;
//   return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[s.screen,dark && s.dark]}>
//     {/* <StatusBar barStyle="light-content" backgroundColor={NAVY}/><View style={s.hero}><View style={s.orb}/><View style={s.heroRow}><TouchableOpacity style={s.iconBtn} onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={22} color="white"/></TouchableOpacity><View style={s.heroCopy}><Text style={s.eyebrow}>TIME OFF</Text><Text style={s.title}>Request leave</Text></View><View style={s.iconBtn}><Ionicons name="calendar" size={21} color="#BFDBFE"/></View></View><Text style={s.subtitle}>Plan your time away in a few simple steps.</Text></View> */}
//     <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
//       <View style={s.profile}><View style={s.avatar}><Text style={s.avatarText}>{(name || 'E')[0].toUpperCase()}</Text></View><View style={s.profileCopy}><Text style={s.caption}>REQUESTING FOR</Text><Text style={s.profileName}>{name || 'Select employee'}</Text><Text style={s.code}>{code || 'Employee code'}</Text></View>{canChoose && <View style={s.switch}><Text style={s.switchText}>Someone else</Text><Switch value={other} onValueChange={v=>{setOther(v); if(!v){setName(p.userName || ''); setCode(loginCode); setEmployee(null); loadTypes(loginCode);}}} trackColor={{false:'#CBD5E1',true:'#93C5FD'}} thumbColor={other ? BLUE : 'white'}/></View>}</View>
//       {other && <Section number="01" title="Choose employee" hint="Who is this request for?"><SingleDropdown data={employees} value={employee} onChange={x=>{setEmployee(x.value); setName(x.label); setCode(x.value); setFromId(null); setToId(null); loadTypes(x.value);}} placeholder="Search employee" style={s.dropdown}/></Section>}
//       <Section number={other ? '02' : '01'} title="Leave details" hint="Tell us a little about your request"><Label>Reason for leave</Label><View><TextinputCompo style={s.area} placeholder="e.g. Family event, personal work…" multiline numberOfLines={4} maxLength={300} value={reason} onChangeText={setReason} autoCapitalize="sentences" placeholderTextColor="#94A3B8"/><Text style={s.counter}>{reason.length}/300</Text></View></Section>
//       <Section number={other ? '03' : '02'} title="Duration" hint="Select dates and leave type"><View style={s.dateRow}>{[['from',from],['to',to]].map(([key,val],i)=><React.Fragment key={key}>{i === 1 && <Ionicons name="arrow-forward" size={18} color="#94A3B8"/>}<TouchableOpacity style={s.dateTile} onPress={()=>{setTarget(key); setCalendar(true);}}><Ionicons name="calendar-outline" size={19} color={BLUE}/><Text style={s.mini}>{key.toUpperCase()}</Text><Text style={[s.dateText,!val && s.placeholder]}>{displayDate(val)}</Text></TouchableOpacity></React.Fragment>)}</View><View style={s.pill}><Ionicons name="sparkles-outline" size={15} color="#7C3AED"/><Text style={s.pillText}>{dayCount ? `${dayCount} calendar ${dayCount === 1 ? 'day' : 'days'}` : 'Choose your leave dates'}</Text></View>
//         <Label>Leave type — first day</Label><SingleDropdown data={types} value={fromId} onChange={x=>{setFromId(x.value); setToId(x.value); setFromType(x.label); setToType(x.label);}} placeholder="Choose leave type" style={s.dropdown}/><TimeBox type={fromType}/>
//         {!sameDay && from && to && <><View style={s.divider}/><Label>Leave type — last day</Label><SingleDropdown data={types} value={toId} onChange={x=>{setToId(x.value); setToType(x.label);}} placeholder="Choose leave type" style={s.dropdown}/><TimeBox type={toType} last/></>}
//       </Section>
//       <View style={s.info}><Ionicons name="information-circle" size={21} color="#0369A1"/><Text style={s.infoText}>Your request will be sent to the assigned leave approver for review.</Text></View><TouchableOpacity disabled={loading} style={s.submit} onPress={submit}><Text style={s.submitText}>Submit request</Text><View style={s.submitIcon}><Ionicons name="arrow-forward" size={19} color={BLUE}/></View></TouchableOpacity>
//     </ScrollView>
//     <Modal visible={calendar} transparent animationType="slide" onRequestClose={()=>setCalendar(false)}><View style={s.overlay}><TouchableOpacity style={StyleSheet.absoluteFill} onPress={()=>setCalendar(false)}/><View style={s.sheet}><View style={s.handle}/><View style={s.sheetHead}><View><Text style={s.eyebrow}>{target === 'from' ? 'START DATE' : 'END DATE'}</Text><Text style={s.sheetTitle}>Choose a date</Text></View><TouchableOpacity style={s.close} onPress={()=>setCalendar(false)}><Ionicons name="close" size={21}/></TouchableOpacity></View><Calendar minDate={target === 'to' && from ? from : new Date().toISOString().split('T')[0]} onDayPress={d=>chooseDate(d.dateString)} markedDates={{...(from ? {[from]:{selected:true,selectedColor:BLUE}} : {}),...(to ? {[to]:{selected:true,selectedColor:BLUE}} : {})}} theme={{calendarBackground:'white',todayTextColor:BLUE,arrowColor:BLUE,monthTextColor:'#0F172A',textMonthFontWeight:'700'}}/></View></View></Modal><Loader visible={loading}/>
//   </KeyboardAvoidingView>;
// };
// export default LeaveRequestForm;

// const s = StyleSheet.create({screen:{flex:1,backgroundColor:'#F1F5F9'},dark:{backgroundColor:'#0F172A'},hero:{backgroundColor:NAVY,padding:20,paddingBottom:34,overflow:'hidden'},orb:{position:'absolute',width:170,height:170,borderRadius:85,backgroundColor:'rgba(37,99,235,.22)',right:-55,top:-75},heroRow:{flexDirection:'row',alignItems:'center'},iconBtn:{width:42,height:42,borderRadius:14,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(255,255,255,.1)'},heroCopy:{flex:1,marginLeft:14},eyebrow:{fontSize:10,fontWeight:'800',letterSpacing:1.7,color:'#93C5FD'},title:{fontSize:25,fontWeight:'800',color:'white'},subtitle:{color:'#BFDBFE',fontSize:13,marginLeft:56,marginTop:13},content:{paddingHorizontal:16,paddingBottom:36},profile:{marginTop:-20,marginBottom:14,padding:14,minHeight:82,borderRadius:20,backgroundColor:'white',flexDirection:'row',alignItems:'center',elevation:5,shadowColor:'#0F172A',shadowOpacity:0.1,shadowRadius:16},avatar:{width:48,height:48,borderRadius:16,backgroundColor:'#DBEAFE',alignItems:'center',justifyContent:'center'},avatarText:{fontSize:20,fontWeight:'800',color:BLUE},profileCopy:{flex:1,marginLeft:12},caption:{fontSize:9,fontWeight:'800',letterSpacing:1.1,color:'#94A3B8'},profileName:{fontSize:16,fontWeight:'700',color:'#0F172A'},code:{fontSize:12,color:MUTED},switch:{alignItems:'center'},switchText:{fontSize:9,fontWeight:'700',color:MUTED},card:{backgroundColor:'white',borderRadius:20,padding:17,marginBottom:14,borderWidth:1,borderColor:BORDER,elevation:2},sectionHead:{flexDirection:'row',alignItems:'center',marginBottom:20},step:{width:38,height:38,borderRadius:13,backgroundColor:'#EFF6FF',alignItems:'center',justifyContent:'center',marginRight:11},stepText:{fontSize:12,fontWeight:'900',color:BLUE},sectionTitle:{fontSize:17,fontWeight:'800',color:'#0F172A'},sectionHint:{fontSize:12,color:MUTED},label:{fontSize:13,fontWeight:'700',color:'#334155',marginBottom:7},req:{color:'#EF4444'},dropdown:{height:54,borderRadius:14,borderColor:BORDER,marginTop:-8},area:{height:110,borderRadius:14,borderColor:BORDER,backgroundColor:'#F8FAFC',padding:14,paddingBottom:25,color:'#0F172A',textAlignVertical:'top'},counter:{position:'absolute',right:12,bottom:8,fontSize:10,color:'#94A3B8'},dateRow:{flexDirection:'row',alignItems:'center',gap:8},dateTile:{flex:1,minHeight:105,borderWidth:1,borderColor:BORDER,borderRadius:16,padding:12,backgroundColor:'#F8FAFC',justifyContent:'space-between'},mini:{fontSize:9,fontWeight:'800',letterSpacing:1,color:MUTED},dateText:{fontSize:13,fontWeight:'700',color:'#0F172A'},placeholder:{color:'#94A3B8'},pill:{alignSelf:'flex-start',flexDirection:'row',alignItems:'center',backgroundColor:'#F5F3FF',borderRadius:20,padding:9,marginVertical:14},pillText:{fontSize:12,fontWeight:'700',color:'#6D28D9',marginLeft:6},divider:{height:1,backgroundColor:'#EEF2F7',marginVertical:18},timeBox:{backgroundColor:'#F8FAFC',borderRadius:15,borderWidth:1,borderColor:BORDER,padding:13,marginTop:5},timeTitle:{flexDirection:'row',alignItems:'center',marginBottom:9},timeTitleText:{fontSize:12,fontWeight:'700',color:'#334155',marginLeft:6},timeRow:{flexDirection:'row',alignItems:'center',gap:9},timeCol:{flex:1},timeInput:{height:44,borderRadius:12,borderColor:BORDER,backgroundColor:'white',color:'#0F172A',fontWeight:'700'},info:{flexDirection:'row',backgroundColor:'#E0F2FE',padding:14,borderRadius:16},infoText:{flex:1,fontSize:12,lineHeight:18,color:'#075985',marginLeft:9},submit:{height:58,borderRadius:18,backgroundColor:BLUE,paddingHorizontal:9,paddingLeft:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:16,elevation:5},submitText:{fontSize:16,fontWeight:'800',color:'white'},submitIcon:{width:42,height:42,borderRadius:14,backgroundColor:'white',alignItems:'center',justifyContent:'center'},overlay:{flex:1,justifyContent:'flex-end',backgroundColor:'rgba(2,6,23,.62)'},sheet:{backgroundColor:'white',borderTopLeftRadius:28,borderTopRightRadius:28,padding:18,paddingBottom:Platform.OS === 'ios' ? 30 : 18},handle:{width:42,height:4,borderRadius:2,backgroundColor:'#CBD5E1',alignSelf:'center',marginBottom:15},sheetHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8},sheetTitle:{fontSize:21,fontWeight:'800',color:'#0F172A'},close:{width:38,height:38,borderRadius:12,backgroundColor:'#F1F5F9',alignItems:'center',justifyContent:'center'}});


import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StatusBar,
  StyleSheet, Switch, Text, TouchableOpacity, useColorScheme, View,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';
import {showMessage} from 'react-native-flash-message';
import {AuthContext} from '../../Screens/Context';
import HeaderCompo from '../../components/HeaderCompo';
import Loader from '../../components/Loader';
import SingleDropdown from '../../components/SingleDropdown';
import TextinputCompo from '../../components/TextinputCompo';
import makeApiCall from '../../utils/apiHelper';
import urls from '../../../url';

const ACCENT = '#4F46E5';
const timedTypes = ['Short Leave', 'First Half', 'Second Half'];

const LeaveRequestForm = ({route, navigation}) => {
  const isDark = useColorScheme() === 'dark';
  const routeParams = route?.params ?? {};
  const serverOrigin = useContext(AuthContext).currentUrl;
  const loginEmpCode = routeParams.employeeCode || '';
  const canDelegate = routeParams.isManager !== 'hr.employee()' || routeParams.leaveManager;
  const [employeeCode, setEmployeeCode] = useState(loginEmpCode);
  const [employeeName, setEmployeeName] = useState(routeParams.userName || '');
  const [forOther, setForOther] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [description, setDescription] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [fromType, setFromType] = useState(null);
  const [toType, setToType] = useState(null);
  const [fromLabel, setFromLabel] = useState(null);
  const [toLabel, setToLabel] = useState(null);
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [lastTimeFrom, setLastTimeFrom] = useState('');
  const [lastTimeTo, setLastTimeTo] = useState('');
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [timing, setTiming] = useState({});
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState('from');
  const [loading, setLoading] = useState(false);

  const colors = isDark
    ? {bg: '#090E1A', card: '#121A2A', text: '#F8FAFC', muted: '#94A3B8', border: '#26344A', input: '#101827', soft: '#20254A'}
    : {bg: '#F5F7FB', card: '#FFFFFF', text: '#172033', muted: '#718096', border: '#E4E9F1', input: '#F9FAFC', soft: '#EEF2FF'};

  const decimalTime = value => {
    if (value === '' || value == null || Number.isNaN(Number(value))) return '';
    const hours = Math.floor(Number(value));
    const minutes = Math.round((Number(value) - hours) * 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };
  const shiftFrom = timing?.shift_timing?.[0]?.hour_from ?? '';
  const shiftTo = timing?.shift_timing?.[0]?.hour_to ?? '';
  const half = shiftFrom !== '' && shiftTo !== '' ? (shiftFrom + shiftTo) / 2 : '';
  const shortTimes = useMemo(() => {
    const limit = Number(timing?.shift_timing?.[0]?.hour_to ?? 19);
    const duration = Number(timing?.short_leave_time || 0);
    const now = new Date();
    const start = Math.min(now.getHours() + now.getMinutes() / 60, limit - duration);
    return {from: decimalTime(start), to: decimalTime(Math.min(start + duration, limit))};
  }, [timing]);

  useEffect(() => {
    if (fromLabel === 'Short Leave') {
      setTimeFrom(shortTimes.from);
      setTimeTo(shortTimes.to);
    } else if (fromLabel === 'First Half') {
      setTimeFrom(decimalTime(shiftFrom));
      setTimeTo(decimalTime(half));
    } else if (fromLabel === 'Second Half') {
      setTimeFrom(decimalTime(half));
      setTimeTo(decimalTime(shiftTo));
    }
  }, [fromLabel, half, shiftFrom, shiftTo, shortTimes]);

  useEffect(() => {
    if (toLabel === 'Short Leave') {
      setLastTimeFrom(shortTimes.from);
      setLastTimeTo(shortTimes.to);
    } else if (toLabel === 'First Half') {
      setLastTimeFrom(decimalTime(shiftFrom));
      setLastTimeTo(decimalTime(half));
    } else if (toLabel === 'Second Half') {
      setLastTimeFrom(decimalTime(half));
      setLastTimeTo(decimalTime(shiftTo));
    }
  }, [half, shiftFrom, shiftTo, shortTimes, toLabel]);

  const resetLeaveSelection = () => {
    setFromType(null);
    setToType(null);
    setFromLabel(null);
    setToLabel(null);
    setTimeFrom('');
    setTimeTo('');
    setLastTimeFrom('');
    setLastTimeTo('');
  };

  const loadLeaveTypes = async code => {
    const response = await makeApiCall(
      serverOrigin,
      urls.getLeaveFromTo,
      'POST',
      {jsonrpc: '2.0', method: 'call', params: {employeeCode: code}},
    );
    if (!response?.result) {
      throw new Error('Leave types are unavailable');
    }
    setTiming(response.result);
    setLeaveTypes(
      (response.result.leave_data || []).map(item => ({
        label: item.name,
        value: item.id,
      })),
    );
  };

  const handleDelegateChange = value => {
    setForOther(value);
    resetLeaveSelection();
    if (!value) {
      setSelectedEmployee(null);
      setEmployeeName(routeParams.userName || '');
      setEmployeeCode(loginEmpCode);
      loadLeaveTypes(loginEmpCode).catch(() => {
        Alert.alert('Unable to load form', 'Self leave types could not be loaded.');
      });
    }
  };

  const handleEmployeeChange = item => {
    setSelectedEmployee(item.value);
    setEmployeeName(item.label);
    setEmployeeCode(item.value);
    resetLeaveSelection();
    loadLeaveTypes(item.value).catch(() => {
      Alert.alert(
        'Unable to load form',
        'Selected employee leave types could not be loaded.',
      );
    });
  };

  useEffect(() => {
    const load = async () => {
      try {
        const body = code => ({jsonrpc: '2.0', method: 'call', params: {employeeCode: code}});
        const [, employeeResponse] = await Promise.all([
          loadLeaveTypes(loginEmpCode),
          makeApiCall(serverOrigin, urls.getLeaveEmployee, 'POST', body(loginEmpCode)),
        ]);
        if (employeeResponse?.result) {
          setEmployees(employeeResponse.result.map(emp => ({label: emp.employee_name.trim(), value: emp.employee_code})));
        }
      } catch (error) {
        Alert.alert('Unable to load form', 'Please check your connection and try again.');
      }
    };
    load();
  }, [loginEmpCode, serverOrigin]);

  const formatDate = value => {
    if (!value) return '';
    const [year, month, day] = value.split('-');
    const name = new Date(+year, +month - 1).toLocaleString('en', {month: 'short'});
    return `${day} ${name} ${year}`;
  };
  const dayCount = useMemo(() => fromDate && toDate ? Math.max(1, Math.round((new Date(toDate) - new Date(fromDate)) / 86400000) + 1) : 0, [fromDate, toDate]);
  const sameDay = Boolean(fromDate && fromDate === toDate);
  const isValidTime = value => {
    if (!/^\d{2}:\d{2}$/.test(value || '')) return false;
    const [hours, minutes] = value.split(':').map(Number);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  };

  const submit = async () => {
    if (!employeeName || !employeeCode || !description.trim() || !fromDate || !toDate || !fromType || (!sameDay && !toType)) {
      Alert.alert('A few details are missing', 'Please complete all required fields before submitting.');
      return;
    }
    if (new Date(toDate) < new Date(fromDate)) {
      Alert.alert('Invalid date range', 'The end date cannot be before the start date.');
      return;
    }
    if (
      (timedTypes.includes(fromLabel) &&
        (!isValidTime(timeFrom) || !isValidTime(timeTo))) ||
      (!sameDay &&
        timedTypes.includes(toLabel) &&
        (!isValidTime(lastTimeFrom) || !isValidTime(lastTimeTo)))
    ) {
      Alert.alert('Invalid time', 'Please enter time in 24-hour HH:MM format.');
      return;
    }
    const firstFrom = timedTypes.includes(fromLabel) ? timeFrom : null;
    const firstTo = timedTypes.includes(fromLabel) ? timeTo : null;
    const lastFrom = timedTypes.includes(toLabel) ? lastTimeFrom : null;
    const lastTo = timedTypes.includes(toLabel) ? lastTimeTo : null;
    try {
      setLoading(true);
      const response = await makeApiCall(serverOrigin, urls.getLeave, 'POST', {
        jsonrpc: '2.0', method: 'call', params: {
          employeeName, employeeCode, description: description.trim(), fromDate, toDate,
          leaveType: null, leaveTypeFrom: fromLabel, leaveTypeTo: sameDay ? fromLabel : toLabel,
          timeFrom: firstFrom, timeTo: firstTo,
          time_from_down: sameDay ? firstFrom : lastFrom,
          time_to_down: sameDay ? firstTo : lastTo,
          selectedRestrictedLeaveID: '', loginEmpCode,
        },
      });
      if (response?.result?.error) {
        showMessage({message: 'Request not submitted', description: String(response.result.error).replace(/[()']/g, ''), type: 'danger'});
      } else if (response?.result) {
        showMessage({message: 'Leave request sent', description: response.result.message || 'Your request is now awaiting approval.', type: 'success'});
        setTimeout(() => navigation.goBack(), 900);
      }
    } catch (error) {
      showMessage({message: 'Something went wrong', description: 'We could not submit your request. Please try again.', type: 'danger'});
    } finally { setLoading(false); }
  };

  const Label = ({children}) => <Text style={[styles.label, {color: colors.text}]}>{children}</Text>;
  const DateField = ({label, value, target}) => (
    <View style={styles.flex}>
      <Label>{label}</Label>
      <TouchableOpacity activeOpacity={0.75} onPress={() => {setCalendarTarget(target); setCalendarVisible(true);}} style={[styles.dateInput, {backgroundColor: colors.input, borderColor: colors.border}]}>
        <View style={[styles.inputIcon, {backgroundColor: colors.soft}]}><Icon name="calendar-outline" size={18} color={ACCENT} /></View>
        <View style={styles.flex}><Text style={[styles.dateValue, {color: value ? colors.text : colors.muted}]}>{value ? formatDate(value) : 'Select date'}</Text><Text style={[styles.dateHint, {color: colors.muted}]}>{target === 'from' ? 'Leave begins' : 'Leave ends'}</Text></View>
        <Icon name="chevron-down" size={16} color={colors.muted} />
      </TouchableOpacity>
    </View>
  );
  const TimeStrip = ({label, isFirst}) => {
    if (!timedTypes.includes(label)) return null;
    const start = isFirst ? timeFrom : lastTimeFrom;
    const end = isFirst ? timeTo : lastTimeTo;
    const changeStart = isFirst ? setTimeFrom : setLastTimeFrom;
    const changeEnd = isFirst ? setTimeTo : setLastTimeTo;
    return (
      <View style={[styles.timeEditor, {backgroundColor: colors.soft}]}>
        <View style={styles.timeHeader}>
          <Icon name="time-outline" size={18} color={ACCENT} />
          <Text style={[styles.timeTitle, {color: colors.text}]}>Leave hours</Text>
          <Text style={[styles.timeLabel, {color: colors.muted}]}>{label}</Text>
        </View>
        <View style={styles.timeFields}>
          <View style={styles.timeField}>
            <Text style={[styles.timeCaption, {color: colors.muted}]}>FROM</Text>
            <TextinputCompo
              value={start}
              onChangeText={changeStart}
              placeholder="HH:MM"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              placeholderTextColor={colors.muted}
              style={[styles.timeInput, {color: colors.text, backgroundColor: colors.input, borderColor: colors.border}]}
            />
          </View>
          <Icon name="arrow-forward" size={18} color={colors.muted} />
          <View style={styles.timeField}>
            <Text style={[styles.timeCaption, {color: colors.muted}]}>TO</Text>
            <TextinputCompo
              value={end}
              onChangeText={changeEnd}
              placeholder="HH:MM"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              placeholderTextColor={colors.muted}
              style={[styles.timeInput, {color: colors.text, backgroundColor: colors.input, borderColor: colors.border}]}
            />
          </View>
        </View>
      </View>
    );
  };
  const SectionHead = ({icon, title, subtitle}) => <View style={styles.sectionHead}><View style={[styles.sectionIcon, {backgroundColor: colors.soft}]}><Icon name={icon} size={19} color={ACCENT} /></View><View><Text style={[styles.sectionTitle, {color: colors.text}]}>{title}</Text><Text style={[styles.sectionSubtitle, {color: colors.muted}]}>{subtitle}</Text></View></View>;

  return (
    <View style={[styles.screen, {backgroundColor: colors.bg}]}>
      <StatusBar barStyle="light-content" backgroundColor="#003E79" />
      <HeaderCompo title="Request Leave" lefticon={require('../../assets/back.png')} onPress={() => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* <View style={styles.hero}>
            <View style={styles.orbOne} /><View style={styles.orbTwo} />
            <View style={styles.heroTop}><View style={styles.heroIcon}><Icon name="airplane" size={23} color="#FFF" /></View><View style={styles.flex}><Text style={styles.eyebrow}>TIME OFF</Text><Text style={styles.heroTitle}>Plan your break</Text><Text style={styles.heroSub}>Share the details and we'll route it for approval.</Text></View></View>
            <View style={styles.steps}>{['Details', 'Duration', 'Review'].map((step, i) => <View key={step} style={styles.step}><View style={[styles.dot, i === 0 && styles.activeDot]}>{i === 0 && <Icon name="checkmark" size={12} color={ACCENT} />}</View><Text style={[styles.stepText, i === 0 && styles.activeStep]}>{step}</Text></View>)}</View>
          </View> */}

          {canDelegate && <View style={[styles.delegate, {backgroundColor: colors.card, borderColor: colors.border}]}><View style={[styles.delegateIcon, {backgroundColor: colors.soft}]}><Icon name="people-outline" size={21} color={ACCENT} /></View><View style={styles.flex}><Text style={[styles.delegateTitle, {color: colors.text}]}>Request for someone else</Text><Text style={[styles.delegateSub, {color: colors.muted}]}>Create leave for a team member</Text></View><Switch value={forOther} onValueChange={handleDelegateChange} trackColor={{false: '#CBD5E1', true: '#A5B4FC'}} thumbColor={forOther ? ACCENT : '#F8FAFC'} /></View>}

          <View style={[styles.card, {backgroundColor: colors.card, borderColor: colors.border}]}>
            <SectionHead icon="person-outline" title="Employee" subtitle="Who is this request for?" />
            {forOther ? <><Label>Team member *</Label><SingleDropdown data={employees} value={selectedEmployee} onChange={handleEmployeeChange} placeholder="Search employee" style={[styles.dropdown, {backgroundColor: colors.input, borderColor: colors.border}]} /></> :
              <View style={[styles.profile, {backgroundColor: colors.input, borderColor: colors.border}]}><View style={styles.avatar}><Text style={styles.avatarText}>{(employeeName || 'E').trim()[0].toUpperCase()}</Text></View><View style={styles.flex}><Text style={[styles.profileName, {color: colors.text}]}>{employeeName || 'Employee'}</Text><Text style={[styles.profileCode, {color: colors.muted}]}>Employee ID  •  {employeeCode || '—'}</Text></View><View style={styles.youBadge}><Icon name="checkmark-circle" size={16} color="#16A34A" /><Text style={styles.youText}>You</Text></View></View>}
          </View>

          <View style={[styles.card, {backgroundColor: colors.card, borderColor: colors.border}]}>
            <SectionHead icon="calendar-clear-outline" title="Leave duration" subtitle="Choose your dates and leave type" />
            <View style={styles.dateRow}><DateField label="From *" value={fromDate} target="from" /><DateField label="To *" value={toDate} target="to" /></View>
            {dayCount > 0 && <View style={[styles.duration, {backgroundColor: colors.soft}]}><Icon name="sparkles-outline" size={15} color={ACCENT} /><Text style={styles.durationText}>{dayCount} {dayCount === 1 ? 'calendar day' : 'calendar days'} selected</Text></View>}
            <Label>Starting day leave type *</Label>
            <SingleDropdown data={leaveTypes} value={fromType} onChange={item => {setFromType(item.value); setFromLabel(item.label); if (!toType) {setToType(item.value); setToLabel(item.label);}}} placeholder="Choose leave type" style={[styles.dropdown, {backgroundColor: colors.input, borderColor: colors.border}]} />
            <TimeStrip label={fromLabel} isFirst />
            {!sameDay && fromDate && toDate && <><Label>Ending day leave type *</Label><SingleDropdown data={leaveTypes} value={toType} onChange={item => {setToType(item.value); setToLabel(item.label);}} placeholder="Choose leave type" style={[styles.dropdown, {backgroundColor: colors.input, borderColor: colors.border}]} /><TimeStrip label={toLabel} /></>}
          </View>

          <View style={[styles.card, {backgroundColor: colors.card, borderColor: colors.border}]}>
            <SectionHead icon="document-text-outline" title="Reason" subtitle="A short note helps your approver" />
            <TextinputCompo placeholder="e.g. Family event, personal appointment..." multiline numberOfLines={4} maxLength={300} value={description} onChangeText={setDescription} autoCapitalize="sentences" placeholderTextColor={colors.muted} style={[styles.reason, {color: colors.text, backgroundColor: colors.input, borderColor: colors.border}]} />
            <Text style={[styles.counter, {color: colors.muted}]}>{description.length}/300</Text>
          </View>
          <TouchableOpacity activeOpacity={0.86} onPress={submit} disabled={loading} style={[styles.submit, loading && styles.disabled]}><Text style={styles.submitText}>{loading ? 'Submitting…' : 'Submit leave request'}</Text>{!loading && <View style={styles.arrow}><Icon name="arrow-forward" size={18} color={ACCENT} /></View>}</TouchableOpacity>
          <Text style={[styles.note, {color: colors.muted}]}><Icon name="shield-checkmark-outline" size={13} color={colors.muted} />  Your manager will be notified after submission</Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={calendarVisible} transparent animationType="fade" onRequestClose={() => setCalendarVisible(false)}><View style={styles.overlay}><TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setCalendarVisible(false)} /><View style={[styles.calendarModal, {backgroundColor: colors.card}]}><View style={styles.handle} /><View style={styles.modalHead}><View><Text style={[styles.modalTitle, {color: colors.text}]}>Select {calendarTarget === 'from' ? 'start' : 'end'} date</Text><Text style={[styles.modalSub, {color: colors.muted}]}>Tap a day to continue</Text></View><TouchableOpacity style={[styles.close, {backgroundColor: colors.input}]} onPress={() => setCalendarVisible(false)}><Icon name="close" size={21} color={colors.text} /></TouchableOpacity></View><Calendar minDate={calendarTarget === 'to' && fromDate ? fromDate : undefined} onDayPress={day => {if (calendarTarget === 'from') {setFromDate(day.dateString); if (!toDate || new Date(toDate) < new Date(day.dateString)) setToDate(day.dateString);} else setToDate(day.dateString); setCalendarVisible(false);}} markedDates={{...(fromDate ? {[fromDate]: {selected: true, selectedColor: ACCENT}} : {}), ...(toDate ? {[toDate]: {selected: true, selectedColor: ACCENT}} : {})}} theme={{calendarBackground: colors.card, dayTextColor: colors.text, monthTextColor: colors.text, arrowColor: ACCENT, textDisabledColor: colors.border, textSectionTitleColor: colors.muted, todayTextColor: ACCENT, textMonthFontWeight: '700'}} /></View></View></Modal>
      <Loader visible={loading} />
    </View>
  );
};

export default LeaveRequestForm;

const styles = StyleSheet.create({
  screen: {flex: 1}, flex: {flex: 1}, content: {padding: 16, paddingBottom: 40},
  hero: {backgroundColor: ACCENT, borderRadius: 24, padding: 20, marginBottom: 14, overflow: 'hidden', shadowColor: ACCENT, shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.22, shadowRadius: 16, elevation: 7},
  orbOne: {position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,.08)', right: -38, top: -65}, orbTwo: {position: 'absolute', width: 95, height: 95, borderRadius: 50, backgroundColor: 'rgba(255,255,255,.06)', left: -35, bottom: -50},
  heroTop: {flexDirection: 'row', alignItems: 'center'}, heroIcon: {width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,.18)', alignItems: 'center', justifyContent: 'center', marginRight: 14}, eyebrow: {fontSize: 10, letterSpacing: 1.8, color: '#C7D2FE', fontWeight: '800'}, heroTitle: {fontSize: 24, color: '#FFF', fontWeight: '800', marginTop: 2}, heroSub: {fontSize: 13, lineHeight: 19, color: '#E0E7FF', marginTop: 4},
  steps: {flexDirection: 'row', marginTop: 22, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,.22)'}, step: {flex: 1, flexDirection: 'row', alignItems: 'center'}, dot: {width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,.45)', marginRight: 7, alignItems: 'center', justifyContent: 'center'}, activeDot: {backgroundColor: '#FFF', borderColor: '#FFF'}, stepText: {fontSize: 11, color: '#C7D2FE', fontWeight: '600'}, activeStep: {color: '#FFF', fontWeight: '800'},
  delegate: {flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 18, padding: 14, marginBottom: 14}, delegateIcon: {width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 11}, delegateTitle: {fontSize: 14, fontWeight: '700'}, delegateSub: {fontSize: 11, marginTop: 3},
  card: {borderWidth: 1, borderRadius: 22, padding: 17, marginBottom: 14, shadowColor: '#0F172A', shadowOffset: {width: 0, height: 4}, shadowOpacity: .04, shadowRadius: 12, elevation: 2}, sectionHead: {flexDirection: 'row', alignItems: 'center', marginBottom: 18}, sectionIcon: {width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 11}, sectionTitle: {fontSize: 16, fontWeight: '800'}, sectionSubtitle: {fontSize: 11, marginTop: 2},
  profile: {borderWidth: 1, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'center'}, avatar: {width: 43, height: 43, borderRadius: 14, backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center', marginRight: 11}, avatarText: {fontSize: 18, fontWeight: '800', color: '#FFF'}, profileName: {fontSize: 15, fontWeight: '700'}, profileCode: {fontSize: 11, marginTop: 4}, youBadge: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF3', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 10}, youText: {fontSize: 10, color: '#15803D', fontWeight: '700', marginLeft: 3},
  label: {fontSize: 12, fontWeight: '700', marginTop: 4, marginBottom: 7}, dateRow: {flexDirection: 'row', gap: 10}, dateInput: {height: 67, borderWidth: 1, borderRadius: 15, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9}, inputIcon: {width: 33, height: 33, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 7}, dateValue: {fontSize: 11, fontWeight: '700'}, dateHint: {fontSize: 9, marginTop: 3}, duration: {alignSelf: 'center', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, paddingVertical: 7, borderRadius: 99, marginVertical: 14}, durationText: {color: ACCENT, fontSize: 11, fontWeight: '700', marginLeft: 5}, dropdown: {height: 54, borderRadius: 14, paddingHorizontal: 13},
  timeEditor: {borderRadius: 15, padding: 12, marginBottom: 14}, timeHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 9}, timeTitle: {fontSize: 12, fontWeight: '700', marginLeft: 6}, timeLabel: {fontSize: 10, marginLeft: 'auto'}, timeFields: {flexDirection: 'row', alignItems: 'center', gap: 9}, timeField: {flex: 1}, timeCaption: {fontSize: 9, fontWeight: '800', letterSpacing: 1, marginBottom: 5}, timeInput: {height: 44, borderRadius: 12, paddingHorizontal: 12, fontSize: 14, fontWeight: '700'}, reason: {height: 112, borderRadius: 15, padding: 13, fontSize: 14, lineHeight: 20, textAlignVertical: 'top'}, counter: {fontSize: 10, textAlign: 'right', marginTop: 6},
  submit: {height: 58, borderRadius: 18, backgroundColor: ACCENT, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, shadowColor: ACCENT, shadowOffset: {width: 0, height: 7}, shadowOpacity: .25, shadowRadius: 12, elevation: 6}, submitText: {color: '#FFF', fontSize: 15, fontWeight: '800'}, arrow: {position: 'absolute', right: 9, width: 40, height: 40, borderRadius: 13, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center'}, disabled: {opacity: .65}, note: {fontSize: 10, textAlign: 'center', marginTop: 13},
  overlay: {flex: 1, backgroundColor: 'rgba(3,7,18,.68)', justifyContent: 'flex-end'}, calendarModal: {borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: Platform.OS === 'ios' ? 36 : 24}, handle: {width: 42, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: 18}, modalHead: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10}, modalTitle: {fontSize: 19, fontWeight: '800'}, modalSub: {fontSize: 11, marginTop: 3}, close: {width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
});
