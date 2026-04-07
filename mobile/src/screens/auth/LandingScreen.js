import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/UI'
import { MaterialIcons } from '@expo/vector-icons'

export default function LandingScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>ARIA</Text>
        <Text style={styles.subtitle}>Your store. Understood.</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconBox}>
          <MaterialIcons name="store" size={64} color="#C97B2E" />
        </View>

        <Text style={styles.title}>Advanced Retail Intelligence Assistant</Text>
        <Text style={styles.description}>
          ARIA is an AI-powered retail intelligence platform. Ask questions, get live insights, manage inventory — all in one place.
        </Text>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <MaterialIcons name="chat" size={24} color="#C97B2E" />
            <Text style={styles.featureText}>AI Chatbot for instant answers</Text>
          </View>

          <View style={styles.featureItem}>
            <MaterialIcons name="trending-up" size={24} color="#C97B2E" />
            <Text style={styles.featureText}>Live sales insights</Text>
          </View>

          <View style={styles.featureItem}>
            <MaterialIcons name="inventory-2" size={24} color="#C97B2E" />
            <Text style={styles.featureText}>Smart inventory management</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Sign Up"
            onPress={() => navigation.navigate('Signup')}
            variant="primary"
            style={styles.button}
          />
          <Button
            title="Sign In"
            onPress={() => navigation.navigate('Login')}
            variant="secondary"
            style={styles.button}
          />
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.shopOwnerSection}>
          <Text style={styles.shopOwnerTitle}>Are you a shop owner?</Text>
          <Text style={styles.shopOwnerDescription}>
            Register your shop and start selling with ARIA's intelligent inventory management.
          </Text>
          <Button
            title="Register Shop"
            onPress={() => navigation.navigate('ShopOwnerSignup')}
            variant="primary"
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by Groq · LLaMA 3.3 70B</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#C97B2E',
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 14,
    color: '#8A8278',
    marginTop: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  iconBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1814',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#8A8278',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  features: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  featureText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#1C1814',
    flex: 1,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#D8D2C8',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#8A8278',
    fontSize: 12,
    fontWeight: '600',
  },
  shopOwnerSection: {
    backgroundColor: '#EDE9E0',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#C97B2E',
  },
  shopOwnerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1814',
    marginBottom: 8,
  },
  shopOwnerDescription: {
    fontSize: 14,
    color: '#8A8278',
    marginBottom: 16,
    lineHeight: 20,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#8A8278',
    fontFamily: 'monospace',
  },
})
