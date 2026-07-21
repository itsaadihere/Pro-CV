import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bot, Send, User, Sparkles, HelpCircle } from 'lucide-react-native';
import { getAICoachReply } from '../../../lib/api';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'assistant',
    text: "Hello! I'm your Sophi AI Career Coach. Ask me anything about your CV bullet points, ATS formatting, interview preparation, or salary negotiation!",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const SUGGESTIONS = [
  "How to explain a career gap?",
  "Salary negotiation tips",
  "Action verbs for bullets",
  "Top ATS resume rules"
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: timeStr
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // AI Reply after brief delay
    setTimeout(() => {
      const replyText = getAICoachReply(query);
      const aiMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Safe Header */}
        <View style={styles.header}>
          <View style={styles.botAvatar}>
            <Bot color="#fff" size={22} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Sophi AI Career Coach</Text>
            <View style={styles.statusRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusText}>Online • Instant Career Advice</Text>
            </View>
          </View>
        </View>

        {/* Quick Suggestion Chips */}
        <View style={styles.suggestionsWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.suggestionsContainer}
          >
            {SUGGESTIONS.map((sug, i) => (
              <TouchableOpacity key={i} style={styles.suggestionChip} onPress={() => sendMessage(sug)}>
                <Sparkles color="#0284c7" size={13} />
                <Text style={styles.suggestionText}>{sug}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(item => (
            <View
              key={item.id}
              style={[
                styles.messageRow,
                item.sender === 'user' ? styles.userRow : styles.assistantRow
              ]}
            >
              {item.sender === 'assistant' && (
                <View style={styles.smallBotAvatar}>
                  <Bot color="#0f2b48" size={14} />
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  item.sender === 'user' ? styles.userBubble : styles.assistantBubble
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    item.sender === 'user' ? styles.userMessageText : styles.assistantMessageText
                  ]}
                >
                  {item.text}
                </Text>
                <Text
                  style={[
                    styles.timestampText,
                    item.sender === 'user' ? styles.userTimestamp : styles.assistantTimestamp
                  ]}
                >
                  {item.timestamp}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Ask Sophi about your resume or career..."
            placeholderTextColor="#94a3b8"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={() => sendMessage()}
            disabled={!inputText.trim()}
          >
            <Send color="#fff" size={18} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#e2e8f0', 
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 8) : 8
  },
  botAvatar: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#0f2b48', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' },
  statusText: { fontSize: 12, color: '#64748b' },
  suggestionsWrapper: { backgroundColor: '#fff', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  suggestionsContainer: { paddingHorizontal: 16, gap: 8 },
  suggestionChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f0f9ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#bae6fd' },
  suggestionText: { fontSize: 12, fontWeight: '600', color: '#0369a1' },
  messagesContainer: { padding: 16, gap: 12 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  userRow: { justifyContent: 'flex-end' },
  assistantRow: { justifyContent: 'flex-start' },
  smallBotAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  userBubble: { backgroundColor: '#0f2b48', borderBottomRightRadius: 2 },
  assistantBubble: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderBottomLeftRadius: 2 },
  messageText: { fontSize: 14, lineHeight: 20 },
  userMessageText: { color: '#fff' },
  assistantMessageText: { color: '#0f172a' },
  timestampText: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  userTimestamp: { color: '#94a3b8' },
  assistantTimestamp: { color: '#94a3b8' },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  input: { flex: 1, height: 46, backgroundColor: '#f1f5f9', borderRadius: 23, paddingHorizontal: 16, fontSize: 14, color: '#0f172a' },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0f2b48', justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { opacity: 0.5 }
});
