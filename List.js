import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { getAction } from "./Actions";

const List = ({ navigation }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredList, setFilteredList] = useState([]);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    (async () => {
      const response = await getAction("https://task-21.herokuapp.com/index");
      setList(response.data);
      setLoading(false);
    })();
  }, []);

  const filterList = (searchValue) => {
    let filtered = list.data.filter((item) => {
      const arr = searchValue.split(" ");
      try {
        return arr.some(
          (el) => item.name.includes(el) || item.surname.includes(el)
        );
      } catch (error) {
        console.log(error);
      }
    });
    setFilteredList(filtered);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Detail", { id: item.id })}
        style={{
          borderWidth: 1,
          width: "100%",
          height: 100,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Image
          style={{ width: 100, height: 100 }}
          source={{
            uri: `data:image/png;base64,${item.photo}`,
          }}
        />
        <View>
          <Text>
            {item.name ? item.name : "BOŞ"}{" "}
            {item.surname ? item.surname : "BOŞ"}{" "}
          </Text>
          <Text>{item.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  if (loading) {
    return (
      <View>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(e) => {
          filterList(e);
          setSearchText(e);
        }}
      />
      <FlatList
        data={filteredList.length == 0 ? list.data : filteredList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
});
