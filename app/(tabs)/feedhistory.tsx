import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

type FeedingHistoryItem = {
  time: string;
  date: string;
  type: string; // 'manual' or 'auto'
};

export default function FeedingHistoryScreen() {
  const [history, setHistory] = useState<FeedingHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<FeedingHistoryItem[]>(
    []
  );
  const [filter, setFilter] = useState<string | null>(null);

  // Load feeding history from AsyncStorage
  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem("feedingHistory");
      if (historyData) {
        const parsedHistory = JSON.parse(historyData);
        setHistory(parsedHistory);
        setFilteredHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Failed to load feeding history:", error);
    }
  };

  // Load history when component mounts
  useEffect(() => {
    loadHistory();
  }, []);

  // Apply filter to the history
  useEffect(() => {
    if (filter === "manual") {
      setFilteredHistory(history.filter((item) => item.type === "manual"));
    } else if (filter === "auto") {
      setFilteredHistory(history.filter((item) => item.type === "auto"));
    } else {
      setFilteredHistory(history);
    }
  }, [filter, history]);

  const renderItem = ({ item }: { item: FeedingHistoryItem }) => (
    <View style={styles.historyItem}>
      <Icon name="calendar" size={20} color="gray" style={styles.icon} />
      <Text style={styles.historyText}>
        {item.time} - {item.date} ({item.type})
      </Text>
    </View>
  );

  const countWeeklyFeedings = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyFeedings = history.filter(
      (item) => new Date(item.date) >= oneWeekAgo
    ).length;
    alert(`Total Feedings This Week: ${weeklyFeedings}`);
  };

  const filterManualFeedings = () => {
    setFilter("manual");
  };

  const filterAutoFeedings = () => {
    setFilter("auto");
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem("feedingHistory");
      setHistory([]);
      setFilteredHistory([]);
      alert("Feeding history cleared!");
    } catch (error) {
      alert("Failed to clear feeding history.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Feeding History</Text>
      {filteredHistory.length === 0 ? (
        <Text style={styles.noHistoryText}>No feedings recorded yet.</Text>
      ) : (
        <FlatList
          data={filteredHistory}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={countWeeklyFeedings}>
          <Text style={styles.buttonText}>Total Feeds This Week</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={filterManualFeedings}>
          <Text style={styles.buttonText}>Manual Feedings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={filterAutoFeedings}>
          <Text style={styles.buttonText}>Auto Feedings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={clearHistory}>
          <Text style={styles.buttonText}>Clear History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  noHistoryText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  icon: {
    marginRight: 10,
  },
  historyText: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "column",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
  },
});
