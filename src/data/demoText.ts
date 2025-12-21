import { Sentence, WordInfo } from "../types/text";

export const textMeta = {
    id: "1",
    title: "Life in a Modern City",
    level: "B2",
    topic: "Society",
    description:
        "A reflective text about daily life, technology, and human interaction in a modern city."
};

export const sentences = [
    {
        id: "s1",
        text: "Living in a modern city offers countless opportunities for personal and professional growth.",
        start: 0,
        end: 5
    },
    {
        id: "s2",
        text: "People are constantly surrounded by technology, information, and fast-paced lifestyles that shape the way they think and communicate.",
        start: 6,
        end: 14
    },
    {
        id: "s3",
        text: "Smartphones, social networks, and digital services allow instant access to knowledge and make daily tasks more efficient.",
        start: 15,
        end: 22
    },
    {
        id: "s4",
        text: "However, this rapid rhythm of life can also be exhausting.",
        start: 23,
        end: 30
    },
    {
        id: "s5",
        text: "Many individuals feel pressure to remain productive at all times, even during moments that were once considered private or relaxing.",
        start: 31,
        end: 38
    },
    {
        id: "s6",
        text: "The constant flow of notifications and responsibilities often leaves little space for silence and reflection.",
        start: 39,
        end: 46
    },
    {
        id: "s7",
        text: "As a result, moments of rest and disconnection become increasingly valuable.",
        start: 47,
        end: 54
    },
    {
        id: "s8",
        text: "People start to appreciate quiet walks, face-to-face conversations, and time spent away from screens.",
        start: 55,
        end: 62
    },
    {
        id: "s9",
        text: "These small pauses help restore mental balance and improve overall well-being.",
        start: 63,
        end: 70
    },
    {
        id: "s10",
        text: "In order to support healthy lifestyles, modern cities must find a balance between technological progress and human needs.",
        start: 71,
        end: 78
    },
    {
        id: "s11",
        text: "Urban spaces should encourage not only efficiency and innovation, but also comfort, connection, and emotional stability.",
        start: 79,
        end: 83
    },
    {
        id: "s12",
        text: "Only by maintaining this balance can city life remain both productive and fulfilling.",
        start: 83,
        end: 86
    }
];


export const words: Record<string, WordInfo> = {
    opportunities: {
        word: "opportunities",
        translation: "возможности",
        transcription: "[ˌɒpəˈtjuːnɪtiz]",
        example: "The city provides many job opportunities."
    },
    surrounded: {
        word: "surrounded",
        translation: "окружённый",
        transcription: "[səˈraʊndɪd]",
        example: "She felt surrounded by people."
    },
    exhausting: {
        word: "exhausting",
        translation: "изнурительный",
        transcription: "[ɪɡˈzɔːstɪŋ]",
        example: "The work schedule was exhausting."
    },
    pressure: {
        word: "pressure",
        translation: "давление",
        transcription: "[ˈpreʃə]",
        example: "He felt pressure to succeed."
    },
    productive: {
        word: "productive",
        translation: "продуктивный",
        transcription: "[prəˈdʌktɪv]",
        example: "She had a productive day."
    },
    balance: {
        word: "balance",
        translation: "баланс",
        transcription: "[ˈbæləns]",
        example: "Work-life balance is important."
    },
    "well-being": {
        word: "well-being",
        translation: "благополучие",
        transcription: "[ˌwel ˈbiːɪŋ]",
        example: "Mental well-being matters."
    }
};
