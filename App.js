import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TextInput, View, Button ,Image ,ToastAndroid ,AsyncStorage } from 'react-native';
let axios = require('axios');
import * as LocalAuthentication from 'expo-local-authentication';

function Authorize(text){
  console.log("Inside Authorize block")
  let url='http://'
  url+=text
  url+=':4500'
  url+='/auth'
  if(text==""||text===''||text===undefined){
    url='http://192.168.1.8:4500/auth'
  }
  console.log("Logging out url ",url)
  fetch(url, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    auth:"AUTH"
  })
  });
   ToastAndroid.showWithGravityAndOffset(
        "Authentication Success",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
}

function SendRejected(){
  console.log("Inside Send Rejected ")
  fetch('http://192.168.1.8:4500/auth', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    auth:"REJECT"
  })
  });
  ToastAndroid.showWithGravityAndOffset(
        "Authentication Failed",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
}

async function setKeyVal(val){
    console.log("Inside setkeyvalue pair")
    try{
      await AsyncStorage.setItem('ip',val)
    }
    catch(err){
      console.log('Error setting key val pair');
    }
}

async function getIp(){
    console.log("inside Get ip")
    try{
     let value=await AsyncStorage.getItem('ip');
     console.log("Value is ",value)
     return value;
    }
    catch(err){
      console.log("Error retreiving ip address");
    }
}

async function CheckSensor(text){
  console.log("Inside Check Sensor Function")
  console.log("Ip address entered ",text)
  setKeyVal(text)
  console.log(LocalAuthentication.hasHardwareAsync())
  console.log(LocalAuthentication.supportedAuthenticationTypesAsync().then(res=>{
    console.log("Response :",res)
  })
  .catch(err=>{
    console.log("Error :",err)
  }))
  console.log(LocalAuthentication.isEnrolledAsync().then(res=>{
    console.log("isenrolled ",res)
  })
  .catch(err=>{
    console.log("isenrolled :",err)
  }))
  console.log(LocalAuthentication.getEnrolledLevelAsync().then(res=>{
    console.log("getenrolled ",res)
  })
  .catch(err=>{
    console.log("getenrolled ",err)
  }))
  console.log("Before status")
  console.log(LocalAuthentication.authenticateAsync(
    {
        promptMessage : "Authenticate",
        cancelLabel :"Click To Cancel",
        fallbackLabel :"Use Passcode"
      }
  ).then(res=>{
    console.log("Response :",res)
    console.log(res.success)
    if(res.success==true){
      Authorize(text);
      // ToastAndroid.showWithGravityAndOffset(
      //   "Authorization Success",
      //   ToastAndroid.LONG,
      //   ToastAndroid.BOTTOM,
      //   25,
      //   50
      // );
    }
    else{
      SendRejected();
      // ToastAndroid.showWithGravityAndOffset(
      //   "Authorization Failed",
      //   ToastAndroid.LONG,
      //   ToastAndroid.BOTTOM,
      //   25,
      //   50
      // );
    }
  })
  .catch(err=>{
    console.log("Error :",err)
  }))
  // let status =await LocalAuthentication.authenticateAsync({
  //   promptMessage : "Authenticate",
  //   cancelLabel :"Click To Cancel",
  //   fallbackLabel :"Use Passcode"
  // }).then(res=>{
  //   console.log("Authentication Successful!!!")
  // })
  // .catch(err=>{
  //   console.log("Authentication Failed !!!")
  // })
  // console.log("Status :",status)
  
}



export default function App() {

  let [text, onChangeText] = React.useState("");

  const textVal=()=>{
    if(text===""){ return getIp(); }
    else{ return text; }
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={require('./assets/fingerprint.png')}
      />

    <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="Enter manual ip here"
      />
      
      <Button 
        onPress={()=>CheckSensor(text)}
        title="Approve"
        color="#0ac238"
        borderColor="#000000"
      />

      <View style={styles.rejectButton}>
        <Button
          onPress={SendRejected}
          title="Reject"
          color="#c20a0a"
          borderColor="#000000"
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 250,
    height: 250,
  },
  rejectButton:{
    paddingTop:20
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 0,
  }
});
