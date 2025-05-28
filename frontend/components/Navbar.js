import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated, Easing } from 'react-native';

import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from '../assets/color';
import { ticket } from "../service/APIservice"; // 💡 nhớ import hàm ticket



const NavBar = ({ user }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const slideAnim = useState(new Animated.Value(-300))[0]; // Menu trượt từ phải vào
    const [ticketCount, setTicketCount] = useState(0); // 🟡 thêm state


    const navigation = useNavigation();
    const handleUserPress = () => {
        if (user) {
            navigation.navigate("Account", { user: user });
        } else {
            navigation.navigate("Login");
        }
    };
    const handleTicketPress = () => {
        if (user) {
            navigation.navigate("PurchasedTicket", { user: user });
        } else {
            navigation.navigate("Login");
        }
    };
    const toggleMenu = () => {
        if (menuVisible) {
            Animated.timing(slideAnim, {
                toValue: -300, // Ẩn menu
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start(() => setMenuVisible(false));
        } else {
            setMenuVisible(true);
            Animated.timing(slideAnim, {
                toValue: 0, // Hiện menu
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();
        }
    };
    const closeMenuIfNeeded = () => {
        if (menuVisible) {
            toggleMenu(); // Đóng menu nếu đang mở
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("user"); // Xoá thông tin tài khoản
        navigation.replace("Home"); // Chuyển về màn hình đăng nhập
    };
    useEffect(() => {
        const fetchTickets = async () => {
            if (user) {
                const result = await ticket(user.id); // 🟢 gọi API lấy vé
                if (result && Array.isArray(result)) {
                    setTicketCount(result.length); // cập nhật số lượng
                }
            }
        };
        fetchTickets();
    }, [user]);
    return (

        <>
            <View style={styles.navicon}>
                <TouchableOpacity onPress={handleUserPress} style={styles.userContainer}>
                    {user ? (
                        <>
                            <Image source={require("../assets/img/avt-icon.png")} style={styles.avatar} />
                            <Text style={styles.username}>{user.name}</Text>
                        </>
                    ) : (
                        <Icon name="user-alt" size={30} color={COLORS.primary} style={styles.icon} />
                    )}
                </TouchableOpacity>
                <View style={styles.naviconright}>
                    <TouchableOpacity onPress={handleTicketPress}>
                        <Icon name="ticket-alt" size={30} color={COLORS.primary} style={styles.icon} />
                        {user && (
                            <Text style={styles.numberTicket}>{ticketCount}</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={toggleMenu}>
                        <Icon name="bars" size={30} color={COLORS.primary} style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>
            {menuVisible && (
                <TouchableWithoutFeedback onPress={closeMenuIfNeeded}>


                    <Animated.View style={[styles.menuContainer, { right: slideAnim }]}>
                        <TouchableOpacity style={styles.menuItem}>
                            <Icon name="bell" size={24} color="gray" />
                            <Text style={styles.menuText}>Thông báo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={handleUserPress}>
                            <Icon name="user" size={24} color="gray" />
                            <Text style={styles.menuText}>Tài khoản</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={handleTicketPress} >
                            <Icon name="ticket-alt" size={24} color="gray" />
                            <Text style={styles.menuText}>Vé</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem}>
                            <Icon name="cog" size={24} color="gray" />
                            <Text style={styles.menuText}>Cài đặt</Text>
                        </TouchableOpacity>
                        {user && (
                            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                                <Icon name="sign-out-alt" size={24} color="red" />
                                <Text style={[styles.menuText, { color: "red" }]}>Đăng xuất</Text>
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                </TouchableWithoutFeedback>
            )}
        </>


    );
};

const styles = StyleSheet.create({
    navicon: {
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#CFCFCF"
    },
    naviconright: {
        flexDirection: "row",
    },
    userContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    username: {
        color: COLORS.primary,
        fontSize: 15,
        fontFamily: "Roboto",
    },
    icon: {
        margin: 10,
        paddingHorizontal: 0
    },
    avatar: {
        width: 30,
        height: 30,
        margin: 10,
        paddingHorizontal: 0
    },
    menuContainer: {
        position: "absolute",
        top: 0,
        right: 0,
        flex: 1,
        height: " 100%",
        backgroundColor: "rgba(255,255,255,.9)", // Lớp nền mờ
        paddingTop: 50,
        paddingHorizontal: 20,
        zIndex: 1000,
        paddingLeft: "10%"
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
    },
    menuText: {
        color: "gray",
        fontSize: 18,
        marginLeft: 15,
        fontFamily: "Roboto",
    },
    numberTicket: {
        position: "absolute",
        right: 0,
        fontweight: "bold",
        color: COLORS.primary,
        fontsize: 15,
    }
});

export default NavBar;
