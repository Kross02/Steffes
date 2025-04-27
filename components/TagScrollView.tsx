import React, { Component } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import ScrollPicker from "react-native-wheel-scrollview-picker";

export default class SimpleExample extends Component {
  state = {
    selectedValue: "Engine",
    selectedIndex: 0
  };

  getCurrentTag = () => {
    return this.state.selectedValue;
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.pickerWrapper}>
          <ScrollPicker
            dataSource={["Engine", "Outside", "Serial #", "Cab", "Other"]}
            selectedIndex={this.state.selectedIndex}
            renderItem={(data, index) => {
              return (
                <View style={[
                  styles.itemContainer,
                  index === this.state.selectedIndex && styles.selectedItemContainer
                ]}>
                  <Text style={styles.itemText}>
                    {data}
                  </Text>
                </View>
              );
            }}
            onValueChange={(data, selectedIndex) => {
              this.setState({
                selectedValue: data,
                selectedIndex: selectedIndex
              });
            }}
            wrapperHeight={180}
            wrapperWidth={60}
            wrapperBackground="#00000000"
            itemHeight={60}
            highlightColor="transparent"
            highlightBorderWidth={0}
          />
        </View>
      </View>
    );
  }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 200,
    right: 15,
    width: 110,
    height: 60,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: '#00000000',
    borderRadius: 10,
    marginTop: 20,
  },
  pickerWrapper: {
    height: 160,
    width: 90,
    transform: [{ rotate: '90deg' }],
    overflow: 'hidden',
  },
  itemContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedItemContainer: {
    backgroundColor: '#222222',
  },
  itemText: {
    fontSize: 18,
    color: '#fff',
  }
});