import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native";
import { getAction } from "./Actions";
import { useTheme } from "react-native-paper";
import { Card, Paragraph } from "react-native-paper";
import { Appbar, Searchbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
const List = ({ navigation }) => {
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();
  useEffect(() => {
    (async () => {
      await getAction("https://task-21.herokuapp.com/index")
        .then((response) => {
          storeData("data", response.data);
        })
        .catch((err) => {
          console.log(err);
        });
      getData("data");
    })();
  }, []);

  const filterList = (searchValue) => {
    return list.data.filter((item) => {
      const fullName = `${item.name}${item.surname}`.toLowerCase();
      const reversedFullName = `${item.surname}${item.name}`.toLowerCase();
      const trimmedSearchValue = searchValue.replace(/\s+/g, "").toLowerCase();
      return (
        fullName.includes(trimmedSearchValue) ||
        reversedFullName.includes(trimmedSearchValue)
      );
    });
  };
  const storeData = async (id, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(id, jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async (id) => {
    try {
      const jsonValue = await AsyncStorage.getItem(id);
      setList(JSON.parse(jsonValue));
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <Card
        mode={"elevated"}
        style={{
          marginBottom: 20,
          width: "95%",
          alignSelf: "center",
          backgroundColor: colors.primary,
          borderRadius: 20,
          overflow: "hidden",
        }}
        onPress={() =>
          navigation.navigate("Detail", {
            id: item.id,
            title: item.name ? item.name + " " + item.surname : "İsim Yok",
            photo: `data:image/png;base64,${item.photo}`,
          })
        }
      >
        <Card.Cover source={{ uri: `data:image/png;base64,${item.photo}` }} />
        <Card.Title
          titleStyle={{ color: colors.surface }}
          title={item.name ? item.name + " " + item.surname : "İsim Yok"}
        />
        <Card.Content>
          <Paragraph style={{ color: colors.surface }}>{item.status}</Paragraph>
        </Card.Content>
      </Card>
    );
  };
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          titleStyle={{ fontWeight: "600", fontSize: 20 }}
          title={"Kişi Listesi"}
        />
      </Appbar.Header>
      <Searchbar
        iconColor={colors.primary}
        autoCapitalize={"none"}
        placeholderTextColor={colors.primary}
        style={{
          width: "95%",
          alignSelf: "center",
          borderRadius: 12,
          marginVertical: 15,
        }}
        placeholder="Kişilerde Ara"
        onChangeText={(e) => {
          setSearchText(e);
        }}
        value={searchText}
      />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={searchText.length === 0 ? list.data : filterList(searchText)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              {searchText.length !== 0 && (
                <Text
                  style={{
                    color: colors.primary,
                    fontWeight: "600",
                    fontSize: 18,
                    marginTop: 10,
                  }}
                >
                  Maalesef Aradığınız Sonuç Bulunamadı.
                </Text>
              )}
            </View>
          )}
        />
      )}
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
