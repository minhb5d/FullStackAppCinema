import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated, Modal, Dimensions } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from '../assets/color';
import { ticket } from "../service/APIservice";

const MENU_WIDTH = 200;

const NavBar = ({ user }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [ticketCount, setTicketCount] = useState(0);
    const slideAnim = useRef(new Animated.Value(MENU_WIDTH)).current; // Bắt đầu ngoài màn hình
    const navigation = useNavigation();

    useEffect(() => {
        if (menuVisible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: MENU_WIDTH,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    }, [menuVisible]);

    useEffect(() => {
        const fetchTickets = async () => {
            if (user) {
                const result = await ticket(user.id);
                if (result && Array.isArray(result)) {
                    setTicketCount(result.length);
                }
            }
        };
        fetchTickets();
    }, [user]);

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
        setMenuVisible(!menuVisible);
    };

    const closeMenuIfNeeded = () => {
        setMenuVisible(false);
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("user");
        navigation.replace("Home");
    };

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

            <Modal
                visible={menuVisible}
                transparent
                animationType="none"
                onRequestClose={closeMenuIfNeeded}
            >
                <TouchableWithoutFeedback onPress={closeMenuIfNeeded}>
                    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0)" }}>
                        <Animated.View
                            style={[
                                styles.menuContainer,
                                {
                                    width: MENU_WIDTH,
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    right: 0,
                                    transform: [{ translateX: slideAnim }]
                                }
                            ]}
                        >
                            <TouchableOpacity style={styles.menuItem}>
                                <Icon name="bell" size={24} color="gray" />
                                <Text style={styles.menuText}>Thông báo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={handleUserPress}>
                                <Icon name="user" size={24} color="gray" />
                                <Text style={styles.menuText}>Tài khoản</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={handleTicketPress}>
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
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
        backgroundColor: "rgba(255,255,255,.8)",
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingLeft: "10%",
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
        fontWeight: "bold",
        color: COLORS.primary,
        fontSize: 15,
    }
});

export default NavBar;
