import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from "axios"; // ✅ Thêm axios để gọi API
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkout } from "../service/APIservice";
import Header from "../components/Header"; // Import Header component

import MovieInfoCard from "../components/MovieInfoCard";
import InfoRow from "../components/InfoRow";
import COLORS from "../assets/color";
import { deleteSeat } from '../service/APIservice'; // Import deleteSeat function




const CheckoutScreen = ({ route, navigation }) => {
    const { movie, selectedDay, selectedTime, selectedSeats, selectedSeatIds, showtimeId, price } = route.params;
    const [loading, setLoading] = useState(false);


    const handlePayment = async () => {
        setLoading(true);
        const userData = await AsyncStorage.getItem("user");
        const user = JSON.parse(userData)


        try {

            const data = {
                suat_chieu_id: showtimeId,
                ghe_ids: selectedSeatIds,

                user_id: parseInt(user.id),
                phuong_thuc_thanh_toan: "MOMO",
                tong_gia: parseFloat(price),
            };
            console.log(data)
            // Gửi dữ liệu đặt vé lên MockAPI
            const response = await checkout(data);
            console.log(response.data);


            setLoading(false);
            Alert.alert("Thành công", response.trang_thai, [
                { text: "OK", onPress: () => navigation.navigate("Home") },
            ]);

        } catch (error) {
            setLoading(false);
            console.log("Lỗi thanh toán:", error);
            Alert.alert("Lỗi", "Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại!");
        }
    };


    const ticketInfo = {


        discount: 0, // Giảm giá
        pointsUsed: 0,
        finalPrice: 250000,
    };


    const backDelete = async () => {
        try {
            const userData = await AsyncStorage.getItem("user");
            const user = JSON.parse(userData);

            const data = {
                suat_chieu_id: showtimeId,
                ghe_ids: selectedSeatIds,
                user_id: parseInt(user.id),
            };

            console.log(data);

            const result = await deleteSeat(data);

            if (result) {
                navigation.goBack();
            } else {
                console.warn("Không thể xoá ghế. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error deleting seats:", error);
        }
    };

    const [secondsLeft, setSecondsLeft] = useState(300); // 5 phút = 300 giây

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    backDelete(); // gọi lại hàm xoá ghế
                    navigation.navigate("Home");

                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval); // cleanup
    }, []);



    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="white" barStyle="dark-content" />

            {/* Tiêu đề */}
            {/* <Header navigation={navigation} title="Thanh Toán" /> */}
            <TouchableOpacity style={styles.header} onPress={backDelete}>
                <Icon name="chevron-left" size={20} color={COLORS.primary} />
                <Text style={styles.headerTitle}>Thanh Toán</Text>
            </TouchableOpacity>

            {/* Thông tin phim */}
            <MovieInfoCard movie={movie} selectedDay={selectedDay} selectedTime={selectedTime} price={price} selectedSeats={selectedSeats} />

            {/* Thông tin vé */}

            <Text style={styles.sectionTitle}>THÔNG TIN VÉ</Text>

            <InfoRow label={"Số lượng"} value={selectedSeats.length} />

            <InfoRow label={"Tổng"} value={price.toLocaleString() + "đ"} />


            {/* Tổng kết */}

            <Text style={styles.sectionTitle}>TỔNG KẾT</Text>


            <InfoRow label={"Giảm giá"} value={ticketInfo.discount.toLocaleString() + "đ"} />

            <InfoRow label={"Tổng cộng"} value={price.toLocaleString() + "đ"} />

            {/* Nút thanh toán */}
            <Text style={{
                textAlign: 'center',
                fontSize: 14,
                color: COLORS.ghe_bi_chiem,
                marginTop: 10,
                fontWeight: 'bold',
            }}>
                {`Thời gian giữ ghế: ${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60).toString().padStart(2, '0')}`}
            </Text>

            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
                <Text style={styles.payButtonText}>{loading ? "Đang thanh toán..." : "Thanh Toán"}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#D9D9D9",
        marginTop: 30,
    },
    header: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: 'white',
        elevation: 2,
        borderBottomWidth: 1,
        borderColor: "#D9D9D9",
    },
    headerTitle: {
        flex: 1,
        paddingLeft: 20,
        fontSize: 18,
        fontFamily: "Roboto", // Added font family
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 10,
        elevation: 3,
    },
    movieImage: {
        width: 80,
        height: 120,
        borderRadius: 8,
    },
    movieInfo: {
        flex: 1,
        marginLeft: 10,
    },
    movieTitle: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Roboto", // Added font family
    },
    text: {
        fontSize: 14,
        color: "#555",
        paddingVertical: 5,
        fontFamily: "Roboto", // Added font family
    },
    totalPrice: {
        fontSize: 14,
        fontWeight: "bold",
        color: "red",
        marginTop: 5,
        fontFamily: "Roboto", // Added font family
    },
    sectionTitle: {
        fontSize: 14,
        color: 'gray',
        padding: 10,
        paddingBottom: 10,
        fontFamily: "Roboto", // Added font family
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#D9D9D9',
        alignItems: "center",
    },
    label: {
        fontSize: 14,
        color: "#555",
        fontFamily: "Roboto", // Added font family
    },
    value: {
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: "Roboto", // Added font family
    },
    arrow: {
        color: "#007bff",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Roboto", // Added font family
    },
    payButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: "center",
        marginTop: 20,
        marginHorizontal: 20,
    },
    payButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Roboto", // Added font family
    },
});

export default CheckoutScreen;
