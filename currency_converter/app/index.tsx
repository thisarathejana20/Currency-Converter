import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

const CURRENCY_CODES = ["USD", "EUR", "GBP", "LKR", "INR", "JPY", "CAD"];

export default function Index() {
  const [amount, setAmount] = useState<string>("1");
  const [baseCurrency, setBaseCurrency] = useState<string>("USD");
  const [targetCurrency, setTargetCurrency] = useState<string>("EUR");
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://open.er-api.com/v6/latest/${baseCurrency}`
      );
      setRates(response.data.rates);
    } catch (error) {
      console.warn("Failed to fetch rates:", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [baseCurrency]);

  useEffect(() => {
    const numericAmount = parseFloat(amount);
    if (rates[targetCurrency] && !isNaN(numericAmount)) {
      const result = (numericAmount * rates[targetCurrency]).toFixed(2);
      setConvertedAmount(result);
    } else {
      setConvertedAmount(null);
    }
  }, [amount, targetCurrency, rates]);
  return (
    <SafeAreaView style={styles.container}>
      <Text className="bg-blue-800">Currency Converter</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
      />

      <Text style={styles.label}>From:</Text>
      <Picker
        selectedValue={baseCurrency}
        onValueChange={(value: string) => setBaseCurrency(value)}
      >
        {CURRENCY_CODES.map((code) => (
          <Picker.Item key={code} label={code} value={code} />
        ))}
      </Picker>

      <Text style={styles.label}>To:</Text>
      <Picker
        selectedValue={targetCurrency}
        onValueChange={(value: string) => setTargetCurrency(value)}
      >
        {CURRENCY_CODES.map((code) => (
          <Picker.Item key={code} label={code} value={code} />
        ))}
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : convertedAmount ? (
        <Text style={styles.result}>
          {amount} {baseCurrency} = {convertedAmount} {targetCurrency}
        </Text>
      ) : (
        <Text style={styles.result}>Enter valid amount</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  label: {
    marginTop: 8,
    fontWeight: "600",
  },
  result: {
    fontSize: 18,
    marginTop: 24,
    textAlign: "center",
    fontWeight: "500",
  },
});
