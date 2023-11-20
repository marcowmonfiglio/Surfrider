import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list'
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Payment" component={PaymentScreen} />
        <Tab.Screen name="Events" component={EventScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function EventScreen() {
  /* ADD MULTI SELECT */
  const [multiSelect, setmultiSelect] = useState(true);
  const [listDataSource, setlistDataSource] = useState(DummyData);

  if (Platform.OS == 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  
  const updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...listDataSource];

    if (multiSelect) {
      array[index]['isExpanded'] = !array[index]['isExpanded'];
    } else {
      array.map((value, placeindex) => 
        placeindex == index
        ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
        : array[placeindex]['isExpanded'] = false
      );
    }
    setlistDataSource(array)
  }

  return (
    
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity>
          {
            listDataSource.map((item, key) => (
              <ExpandableComponent
                key={item.event_name}
                item={item}
                onClickFunction={() => {
                  updateLayout(key)
                }}
              />
            ))
          }
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setmultiSelect(!multiSelect)}
        >
          <Text style={styles.headerButton}>
            Currently Enabled:
          </Text>
          <Text style={styles.headerButton}>
            {
              multiSelect 
              ? 'Multiselect'
              : 'Singleselect'
            }
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ExpandableComponent = ({item, onClickFunction}) => {
  const [layoutHeight, setlayoutHeight] = useState(0);

  useEffect(() => {
    if (item.isExpanded) {
      setlayoutHeight(null)
    } else {
      setlayoutHeight(0)
    }
  }, [item.isExpanded])

  return (
    <View>
      <TouchableOpacity 
        style={styles.item}
        onPress={onClickFunction}>
        <Text style={styles.itemText}>
          {item.event_name}
        </Text>
        <Text style={styles.itemText}>
          {item.event_date}
        </Text>
      </TouchableOpacity>
      <View 
      style={{
        height: layoutHeight,
        overflow: 'hidden'
      }}
      >
        {
          item.records.map((item, key) => (
            <TouchableOpacity
              style={styles.content}
              key={key}
            >
              <Text style={styles.text}>
                Name: {item.name}; Cup Returned: {item.cup_returned}
              </Text>
          </TouchableOpacity>
          ))
        }
      </View>
    </View>
  )
}

function PaymentScreen() {

  /* NAME, VENMO, PHONE #, CUP QUANTITY, EVENT */

  const [nameText, setnameText] = useState("");
  const [venmoTagText, setvenmoTagText] = useState("");
  const [phoneNumberText, setphoneNumberText] = useState("");
  const [quantity, setQuantity] = React.useState("");
  const [selectedEvent, setselectedEvent] = React.useState("");
  const [paymentStatus, setpaymentStatus] = React.useState("");

  const [listDataSource, setlistDataSource] = useState(DummyData);

  function clearInputs() {
    setnameText("");
    setvenmoTagText("");
    setphoneNumberText("");
    setQuantity("");
    setselectedEvent("Select Option");
  }

  function checkInputs() {
    return (nameText == "" || venmoTagText == "" || phoneNumberText == "" || quantity == "" || selectedEvent == "Select Option")
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setnameText}
        placeholder="Name"
        value={nameText}
      />
      <TextInput
        style={styles.input}
        onChangeText={setvenmoTagText}
        placeholder="Venmo (inc. @)"
        value={venmoTagText}
      />
      <TextInput
        style={styles.input}
        onChangeText={setphoneNumberText}
        placeholder="Phone Number"
        value={phoneNumberText}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        onChangeText={setQuantity}
        placeholder="Quantity"
        value={quantity}
        keyboardType="numeric"
      />
      <SelectList 
        setSelected={(val) => setselectedEvent(val)} 
        data={["Select Option", ...listDataSource.map((event) => 
          event.event_name
        )]} 
        search={false}
        save="event_name"
    />
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        if (checkInputs()) {
          setpaymentStatus("Fields Missing!")
        } else {
          const temp = listDataSource.map((event) => {
            if (event.event_name == selectedEvent) {
              event.records = [...event.records, {name: nameText, cup_returned: "No"}];
            }
            return event;
          })
          setlistDataSource(temp)
          setpaymentStatus("Payment Received!")
          clearInputs()
          console.log('Cleared Inputs')
        }
      }}
    >
      <Text style={styles.text}>
        Submit Payment
      </Text>
    </TouchableOpacity>
    <Text>
      {paymentStatus}
    </Text>
    </View>
  );
}

const DummyData = [
  {
    isExpanded: false,
    event_name: 'World Water Day',
    event_date: '3/22/23',
    records: [
      {name: "User 1", cup_returned: "No"},
      {name: "User 2", cup_returned: "Yes"},
      {name: "User 3", cup_returned: "Yes"},
    ]
  },
  {
    isExpanded: false,
    event_name: 'International Surfing Day',
    event_date: '6/17/23',
    records: [
      {uid: 1, name: "User 1", cup_returned: "No"},
      {uid: 4, name: "User 4", cup_returned: "No"},
      {uid: 5, name: "User 5", cup_returned: "Yes"},
    ]
  }
]

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'column',
    padding: 10,
    borderTopColor: 'black',
    backgroundColor: 'gold',
    borderTopWidth: 1,
  },
  titleText: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold'
  },
  headerButton: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 18
  },
  item: {
    backgroundColor: '#A1CDDF',
    padding: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500'
  },
  content: {
    backgroundColor: '#dbdbdb'
  },
  text: {
    fontSize: 16,
    padding: 10
  },
  separator: {
    height: 0.5,
    backgroundColor: '#orange',
    width: '100%'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    backgroundColor: '#A1CDDF',
    padding: 20,
    borderColor: 'black',
    borderWidth: 1,
    margin: 12,
    alignItems: 'center',
    borderRadius: 20
  }
});
