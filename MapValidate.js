import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

function rayCasting(point, polygon) {
  const n = polygon.length;
  let isIn = false;
  const x = point[0];
  const y = point[1];
  let x1, x2, y1, y2;

  x1 = polygon[n - 1][0];
  y1 = polygon[n - 1][1];

  for (let i = 0; i < n; ++i) {
    x2 = polygon[i][0];
    y2 = polygon[i][1];

    if (y < y1 !== y < y2 && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) {
      isIn = !isIn;
    }
    x1 = x2;
    y1 = y2;
  }

  return isIn;
}

const MapValidate = () => {
  const [validationResult, setValidationResult] = useState("");
  const [data, setData] = useState(null);
  const [address, setAddress] = useState("");
  const [point, setPoint] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`API_URL`, {
          headers: {
            Authorization: `Bearer API_TOKEN`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
        setValidationResult("Please enter an address.");
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const polygon = data?.data?.attributes?.polygon?.[0]?.latlngs?.map(
    (latlng) => [latlng.lng, latlng.lat]
  );

  const handleValidate = async () => {
    if (!address) {
      setValidationResult("Please enter an address.");
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address
        )}&format=json&limit=1`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseText = await response.text();
      const jsonData = JSON.parse(responseText);

      if (!jsonData.length) {
        setValidationResult("Address not found");
        return;
      }
      const { lat, lon } = jsonData[0];
      const point = [parseFloat(lon), parseFloat(lat)];
      const isInsidePolygon = rayCasting(point, polygon);
      setValidationResult(
        isInsidePolygon
          ? "Address inside the polygon"
          : "Address outside the polygon"
      );
      if (isInsidePolygon) {
        // Store the validated address in the phone's storage
        await AsyncStorage.setItem("validatedAddress", address);
        await AsyncStorage.setItem("validatedAddressPoint", `${point}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setValidationResult("Something went wrong");
    }
  };

  return (
    <>
      <View style={styles.blockView}>
        <Text>Check the address</Text>
        <TextInput
          style={styles.addressInput}
          placeholder={"Enter Address"}
          value={address}
          onChangeText={setAddress}
        />
        <Text>{validationResult}</Text>
        <TouchableOpacity
          style={styles.verifyAddressBtn}
          onPress={handleValidate}
        >
          <Text>{"Check address"}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  mainViewNoBG: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    position: "absolute",
  },
  blockView: {
    backgroundColor: "white",
    borderRadius: 10,
    top: screenWidth >= 768 ? 75 : 60,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: screenWidth >= 768 ? "50%" : "75%",
    height: "auto",
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  closeBtn: {
    position: "absolute",
    zIndex: 9999,
    right: 10,
    top: 10, // use top 20 if device is iOS, otherwise use top 10
  },
  verifyAddressBtn: {
    backgroundColor: "blue",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 5,
    marginTop: 15,
  },
  addressInput: {
    backgroundColor: "#e6e6e8",
    width: "85%",
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    marginRight: 5,
    marginTop: 15,
  },
});

export default MapValidate;
