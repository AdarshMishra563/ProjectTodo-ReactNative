import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const Loading = () => {
  const [translateY] = useState(new Animated.Value(0));

  useEffect(() => {
    const bounceAnimation = () => {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -5,
          duration: 250,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => bounceAnimation());
    };

    bounceAnimation();

    return () => {
      translateY.stopAnimation();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ translateY }],
        }}
      >
        <Svg width={50} height={50} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth="2" fill="none" />
          <Path d="M8 12l2 2 4-4" stroke="#ffffff" strokeWidth="2" fill="none" />
        </Svg>
      </Animated.View>
      
      <Text style={styles.text}>Todo App</Text>
    </View>
  );
};


import Svg, { Circle, Path } from 'react-native-svg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#374151', 
  },
  text: {
    color: '#ffffff',
    fontSize: 20,
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default Loading;