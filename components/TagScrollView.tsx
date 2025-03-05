import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import ScrollPicker from "react-native-wheel-scrollview-picker";

export default class SimpleExample extends Component {
  state = {
    selectedValue: "2",
    selectedIndex: 1
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.selectedText}>
          Selected: {this.state.selectedValue}
        </Text>
        <ScrollPicker
          dataSource={["Food", "Travel", "Family", "Work", "Pets", "Nature", "Other"]}
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
          wrapperBackground="#FFFFFF"
          itemHeight={60}
          highlightColor="transparent"
          highlightBorderWidth={0}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderRadius: 10,
    marginTop: 20,
  },
  selectedText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  itemContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedItemContainer: {
    backgroundColor: '#d8d8d8',
  },
  itemText: {
    fontSize: 30,
    color: '#333',
  }
});