import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
  return <Image resizeMode='contain' source={require('../assets/logo.png')} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
     width: 260,
    height: 120,
    marginBottom: 0,
  },
})
