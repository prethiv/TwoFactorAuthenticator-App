import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button ,Image } from 'react-native';
let axios = require('axios');
import * as LocalAuthentication from 'expo-local-authentication';

function Authorize(){
  console.log("Inside Authorize block")
  fetch('http://192.168.1.8:4500/auth', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    auth:"AUTH"
  })
  });
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
}

async function CheckSensor(){
  console.log("Inside Check Sensor Function")
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
      Authorize();
    }
    else{
      SendRejected();
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
  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={require('./assets/fingerprint.png')}
      />
      
      <Button 
        onPress={CheckSensor}
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
  }
});
