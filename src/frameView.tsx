import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Animated } from 'react-native';
import performance from 'react-native-performance';

const FrameView = () => {
  const [running, setRunning] = useState(false);
  // const fpsRef = useRef(0);
  const lastTime = useRef(Date.now());
  const animations = useRef([...Array(100)].map(() => new Animated.Value(0)));
  const [fpsAvg, setFpsAvg] = useState(0);

  const startTest = async () => {
    setRunning(true);
    // fpsRef.current = 0;
    lastTime.current = Date.now();
    let frameCount = 0;
    let fpsSum = 0;

    animations.current.forEach(anim => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    });

    const measureFrame = () => {
      const now = Date.now();
      const delta = now - lastTime.current;
      lastTime.current = now;

      const fps = 1000 / delta;
      fpsSum += fps;
      frameCount++;

      if (running) requestAnimationFrame(measureFrame);
    };
    measureFrame();

    setTimeout(async () => {
      setRunning(false);

      console.log(`teste: soma ${fpsSum}; contador ${frameCount} `)

      const avgFps = fpsSum / frameCount;
      setFpsAvg(avgFps);
      console.log('FPS médio final:', avgFps.toFixed(2));
    }, 10000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Text style={{ color: '#fff', fontSize: 20, marginTop: 20, marginLeft: 15 }}>FPS: {Math.round(fpsAvg)}</Text>

      <TouchableOpacity style={{marginLeft: 15}} onPress={() => startTest()}>
        <Text style={{ color: '#fff' }}>
            {running ? 'Testando...' : 'Iniciar Teste FPS'}
        </Text>
      </TouchableOpacity>

      {animations.current.map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            width: 20,
            height: 20,
            marginLeft: 15,
            backgroundColor: anim.interpolate({
              inputRange: [0, 1],
              outputRange: ['red', 'yellow'],
            }),
            margin: 1,
          }}
        />
      ))}
    </View>
  );
}

export default FrameView;