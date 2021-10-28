import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import { getAction } from "./Actions";
const Detail = ({ route, navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const response = await getAction(
        `https://task-21.herokuapp.com/show/${route.params.id}`
      );
      setData(response.data.data);
      setLoading(false);
    })();
  }, []);
  if (loading) {
    return (
      <View>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Image
        style={{ width: "60%", height: 300 }}
        source={{
          uri: `data:image/png;base64,${data.photo}`,
        }}
      />
      <Text>{route.params.id}</Text>
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
});
