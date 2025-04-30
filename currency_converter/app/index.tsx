import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  useColorScheme,
  SafeAreaView,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import ModalDropdown from "react-native-modal-dropdown";
import Dropdown from "./components/Dropdown";

const CURRENCY_CODES = ["USD", "EUR", "GBP", "LKR", "INR", "JPY", "CAD"];

export default function Index() {
  const [amount, setAmount] = useState<string>("1");
  const [baseCurrency, setBaseCurrency] = useState<string>("USD");
  const [targetCurrency, setTargetCurrency] = useState<string>("EUR");
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const deviceScheme = useColorScheme();
  const [theme, setTheme] = useState<"light" | "dark">(
    deviceScheme === "dark" ? "dark" : "light"
  );

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
    <SafeAreaView
      className={`${
        theme === "dark" ? "bg-zinc-900" : "bg-white"
      } flex-1 px-4 pt-10`}
    >
      {/* Toggle Button */}
      <View className="flex-row justify-end mb-4">
        <Pressable
          onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="px-4 py-2 rounded-full bg-blue-600 dark:bg-blue-400"
        >
          <Text className="text-white dark:text-black font-medium">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Text>
        </Pressable>
      </View>
      <Text className="text-3xl font-bold text-center mb-6 text-blue-700 dark:text-blue-400">
        Currency Converter
      </Text>

      <TextInput
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        placeholderTextColor="#aaa"
        className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 mb-4 text-lg bg-white dark:bg-zinc-800 text-black dark:text-white"
      />

      <Text className="font-semibold text-base text-gray-700 dark:text-gray-300 mb-1">
        From:
      </Text>
      <View className="border border-gray-300 dark:border-gray-700 rounded-lg mb-4 bg-white dark:bg-zinc-800">
        <Dropdown
          options={CURRENCY_CODES}
          defaultValue={baseCurrency}
          onChange={(index: string, value: string) => {
            setBaseCurrency(value);
            setConvertedAmount(null); // Reset converted amount when base currency changes
          }}
        />
      </View>

      <Text className="font-semibold text-base text-gray-700 dark:text-gray-300 mb-1">
        To:
      </Text>
      <View className="border border-gray-300 dark:border-gray-700 rounded-lg mb-4 bg-white dark:bg-zinc-800">
        <Dropdown
          options={CURRENCY_CODES}
          defaultValue={targetCurrency}
          onChange={(index: string, value: string) => {
            setTargetCurrency(value);
            setConvertedAmount(null); // Reset converted amount when target currency changes
          }}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" />
      ) : convertedAmount ? (
        <Text className="text-xl font-semibold text-center text-green-600 dark:text-green-400 mt-6">
          {amount} {baseCurrency} = {convertedAmount} {targetCurrency}
        </Text>
      ) : (
        <Text className="text-center text-red-500 mt-6">
          Enter valid amount
        </Text>
      )}
    </SafeAreaView>
  );
}
