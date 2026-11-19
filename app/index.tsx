import React,{useEffect,useState} from 'react';
import {View,Text,TextInput,Pressable,ScrollView,StyleSheet,Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
Notifications.setNotificationHandler({handleNotification:async()=>({shouldShowBanner:true,shouldShowList:true,shouldPlaySound:true,shouldSetBadge:false})});
const BG='#05090a',PANEL='#10191b',LINE='#345056',TEAL='#83c0c3',WHITE='#f2f5f5';
type Payment={id:string;amount:number;sender:string;time:string};
export default function Home(){
 const [tab,setTab]=useState('Home'),[amount,setAmount]=useState('18750'),[sender,setSender]=useState('Business Revenue'),[minutes,setMinutes]=useState('1'),[automatic,setAutomatic]=useState(false),[history,setHistory]=useState<Payment[]>([]);
 useEffect(()=>{AsyncStorage.getItem('payments').then(v=>{if(v)setHistory(JSON.parse(v))}).catch(()=>{});Notifications.requestPermissionsAsync().catch(()=>{});},[]);
 const money=(v:number)=>new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD'}).format(v);
 async function schedule(){
  const value=Number(amount),delay=Number(minutes);
  if(!Number.isFinite(value)||value<=0||!Number.isFinite(delay)||delay<1){Alert.alert('Invalid payment','Enter a positive amount and at least 1 minute.');return;}
  try{
   const granted=await Notifications.requestPermissionsAsync();if(!granted.granted){Alert.alert('Notifications disabled','Enable notifications in device settings.');return;}
   const finalAmount=automatic?Math.round((100+Math.random()*value)*100)/100:value;
   await Notifications.scheduleNotificationAsync({content:{title:'Payment Received • Simulation',body:money(finalAmount)+' AUD — From: '+sender,data:{simulation:true}},trigger:{type:Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,seconds:Math.round(delay*60)}});
   const next=[{id:String(Date.now()),amount:finalAmount,sender,time:new Date(Date.now()+delay*60000).toLocaleString()},...history];setHistory(next);await AsyncStorage.setItem('payments',JSON.stringify(next));Alert.alert('Scheduled','Simulated payment alert scheduled.');
  }catch(e){Alert.alert('Unable to schedule',String(e))}
 }
 const Button=({label,onPress,active=false}:{label:string;onPress:()=>void;active?:boolean})=><Pressable onPress={onPress} style={[s.button,active&&s.active]}><Text style={[s.buttonText,active&&{color:BG}]}>{label}</Text></Pressable>;
 return <View style={s.root}><Text style={s.brand}>PAYMENT RECEIVED</Text><Text style={s.sub}>WEALTH SIMULATOR · BLVCK OAK</Text><View style={s.tabs}>{['Home','Create','History'].map(t=><Button key={t} label={t} active={tab===t} onPress={()=>setTab(t)}/>)}</View><ScrollView contentContainerStyle={{paddingBottom:60}}>
 {tab==='Home'&&<><Text style={s.label}>SIMULATED ACCOUNT BALANCE</Text><Text style={s.balance}>{money(history.reduce((a,p)=>a+p.amount,0))}</Text><View style={s.panel}><Text style={s.label}>SCHEDULED PAYMENTS</Text><Text style={s.value}>{history.length}</Text><Text style={s.muted}>All payments are fictional and have no monetary value.</Text></View><Button label="CREATE PAYMENT +" onPress={()=>setTab('Create')}/></>}
 {tab==='Create'&&<><Text style={s.heading}>CREATE PAYMENT</Text><Text style={s.label}>MODE</Text><View style={s.tabs}><Button label="Custom" active={!automatic} onPress={()=>setAutomatic(false)}/><Button label="Automatic" active={automatic} onPress={()=>setAutomatic(true)}/></View><Text style={s.label}>{automatic?'MAXIMUM RANDOM AMOUNT (AUD)':'AMOUNT (AUD)'}</Text><TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" style={s.input} placeholderTextColor="#7b9094"/><Text style={s.label}>SENDER</Text><TextInput value={sender} onChangeText={setSender} style={s.input}/><Text style={s.label}>NOTIFY AFTER (MINUTES)</Text><TextInput value={minutes} onChangeText={setMinutes} keyboardType="number-pad" style={s.input}/><Button label="SCHEDULE SIMULATED PAYMENT" onPress={schedule}/></>}
 {tab==='History'&&<><Text style={s.heading}>SIMULATED TRANSACTIONS</Text>{history.length===0?<Text style={s.muted}>No payments scheduled yet.</Text>:history.map(p=><View key={p.id} style={s.panel}><Text style={s.value}>{money(p.amount)}</Text><Text style={s.muted}>{p.sender} · {p.time}</Text><Text style={s.label}>SIMULATION</Text></View>)}</>}
 </ScrollView></View>
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:BG,paddingTop:70,paddingHorizontal:22},brand:{color:WHITE,fontSize:24,fontWeight:'700',letterSpacing:3},sub:{color:TEAL,fontSize:10,letterSpacing:3,marginTop:9,marginBottom:28},tabs:{flexDirection:'row',gap:6,marginBottom:24},button:{flex:1,borderWidth:1,borderColor:LINE,backgroundColor:PANEL,paddingVertical:15,paddingHorizontal:10,marginBottom:10,alignItems:'center'},active:{backgroundColor:TEAL,borderColor:TEAL},buttonText:{color:WHITE,fontWeight:'600',fontSize:12,letterSpacing:1},label:{color:'#b2c3c5',fontSize:11,letterSpacing:1.5,marginTop:14,marginBottom:12},balance:{color:WHITE,fontSize:35,fontWeight:'700',marginBottom:28},panel:{borderWidth:1,borderColor:LINE,backgroundColor:PANEL,padding:20,marginBottom:15},value:{color:WHITE,fontSize:23,fontWeight:'700',marginBottom:8},muted:{color:'#a1b1b3',fontSize:13,lineHeight:20},heading:{color:WHITE,fontSize:21,fontWeight:'700',marginBottom:22},input:{borderWidth:1,borderColor:LINE,backgroundColor:PANEL,color:WHITE,fontSize:19,padding:16,marginBottom:15}});
