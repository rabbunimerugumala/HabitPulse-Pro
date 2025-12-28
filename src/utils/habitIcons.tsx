import React from 'react';
import { FaRunning, FaHeart, FaDumbbell, FaTint, FaClipboardList, FaBriefcase, FaCode, FaClock, FaBook, FaBrain, FaLaptop, FaSpa, FaWallet, FaChartLine, FaAppleAlt, FaCheckSquare, FaLeaf } from 'react-icons/fa';

export const ICON_MAP: Record<string, JSX.Element> = {
    "run": <FaRunning />,
    "heart": <FaHeart />,
    "gym": <FaDumbbell />,
    "water": <FaTint />,
    "apple": <FaAppleAlt />,
    "list": <FaClipboardList />,
    "check": <FaCheckSquare />,
    "work": <FaBriefcase />,
    "code": <FaCode />,
    "clock": <FaClock />,
    "book": <FaBook />,
    "brain": <FaBrain />,
    "laptop": <FaLaptop />,
    "leaf": <FaLeaf />,
    "meditate": <FaSpa />,
    "wallet": <FaWallet />,
    "chart": <FaChartLine />,
};

export const getHabitIcon = (keyOrEmoji: string) => {
    // Check if it's a key in our map
    if (ICON_MAP[keyOrEmoji]) {
        return ICON_MAP[keyOrEmoji];
    }
    // Fallback: If it's an emoji (short string), return it as text?
    // Or just default icon.
    // If string length < 4 (emoji), return it inside a span?
    // For now return null or default in component
    return null;
};
