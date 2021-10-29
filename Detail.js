import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { getAction } from "./Actions";
import { Appbar } from "react-native-paper";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Detail = ({ route, navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(true);
  const { colors } = useTheme();
  useEffect(() => {
    (async () => {
      await getAction(`https://task-21.herokuapp.com/show/${route.params.id}`)
        .then((response) => {
          storeData(route.params.id, response.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
      getData(route.params.id);
    })();
  }, []);

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
      setData(JSON.parse(jsonValue));
      setloading(false);
    } catch (e) {
      console.log("ERROR");
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          titleStyle={{ fontWeight: "600", fontSize: 20 }}
          title={route.params.title}
        />
      </Appbar.Header>
      <View
        style={[styles.imageContainer, { backgroundColor: colors.primary }]}
      >
        <Image
          style={{
            width: 150,
            height: 150,
            borderRadius: 100,
          }}
          source={{
            uri: `${route.params.photo}`,
          }}
        />
        <Text style={styles.name}>{route.params.title}</Text>
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView>
          <View style={[styles.info, { borderBottomColor: colors.backdrop }]}>
            <Text style={[styles.infoText, { color: colors.placeholder }]}>
              Doğum Yeri
            </Text>
            <Text style={[styles.infoText, { color: colors.text }]}>
              {data.birth_place}
            </Text>
          </View>
          <View style={[styles.info, { borderBottomColor: colors.backdrop }]}>
            <Text style={[styles.infoText, { color: colors.placeholder }]}>
              Doğum Tarihi
            </Text>
            <Text style={[styles.infoText, { color: colors.text }]}>
              {data.birthday}
            </Text>
          </View>
          <View style={[styles.info, { borderBottomColor: colors.backdrop }]}>
            <Text style={[styles.infoText, { color: colors.placeholder }]}>
              Şehir
            </Text>
            <Text style={[styles.infoText, { color: colors.text }]}>
              {data.city}
            </Text>
          </View>
          <View style={[styles.info, { borderBottomColor: colors.backdrop }]}>
            <Text style={[styles.infoText, { color: colors.placeholder }]}>
              Baba Adı
            </Text>
            <Text style={[styles.infoText, { color: colors.text }]}>
              {data.father_name}
            </Text>
          </View>
          <View style={[styles.info, { borderBottomColor: colors.backdrop }]}>
            <Text style={[styles.infoText, { color: colors.placeholder }]}>
              Anne Adı
            </Text>
            <Text style={[styles.infoText, { color: colors.text }]}>
              {data.mother_name}
            </Text>
          </View>
          <View style={[styles.info, { borderBottomColor: colors.backdrop }]}>
            <Text style={[styles.infoText, { color: colors.placeholder }]}>
              Cinsiyet
            </Text>
            <Text style={[styles.infoText, { color: colors.text }]}>
              {data.gender === "female" ? "Kadın" : "Erkek"}
            </Text>
          </View>
          <View style={[styles.info, { borderBottomColor: colors.backdrop }]}>
            <Text style={[styles.infoText, { color: colors.placeholder }]}>
              TC Kimlik No
            </Text>
            <Text style={[styles.infoText, { color: colors.text }]}>
              {data.identity_number}
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: "35%",
    display: "flex",
    alignItems: "center",
    paddingTop: 25,
    borderBottomRightRadius: 60,
  },
  name: {
    color: "white",
    fontSize: 18,
    marginTop: 10,
  },
  info: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: 15,
    borderBottomWidth: 0.5,
  },
  infoText: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 10,
  },
});
