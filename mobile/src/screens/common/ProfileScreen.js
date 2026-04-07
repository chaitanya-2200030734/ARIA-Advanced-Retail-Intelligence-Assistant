import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/UI'
import { MaterialIcons } from '@expo/vector-icons'

export default function ProfileScreen() {
  const { user, role, logout, isAdmin } = useAuth()
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
  })

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.fullName || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        phone: user.phone || '+91-XXXXXXXXXX',
        role: isAdmin ? 'Admin' : 'Customer',
      })
    }
  }, [user, isAdmin])

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ])
  }

  const renderProfileField = (label, value, icon) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <MaterialIcons name={icon} size={20} color="#C97B2E" />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile.name[0]?.toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.roleText}>{profile.role}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        {renderProfileField('Email', profile.email, 'email')}
        {renderProfileField('Phone', profile.phone, 'phone')}
        {renderProfileField('Account Type', profile.role, 'account-circle')}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity style={styles.settingRow}>
          <MaterialIcons name="notifications" size={20} color="#8A8278" />
          <Text style={styles.settingLabel}>Push Notifications</Text>
          <MaterialIcons name="chevron-right" size={20} color="#D8D2C8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <MaterialIcons name="language" size={20} color="#8A8278" />
          <Text style={styles.settingLabel}>Language</Text>
          <Text style={styles.settingValue}>English</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <MaterialIcons name="dark-mode" size={20} color="#8A8278" />
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <MaterialIcons name="chevron-right" size={20} color="#D8D2C8" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help & Support</Text>

        <TouchableOpacity style={styles.helpRow}>
          <MaterialIcons name="help-outline" size={20} color="#8A8278" />
          <Text style={styles.helpLabel}>FAQ</Text>
          <MaterialIcons name="chevron-right" size={20} color="#D8D2C8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.helpRow}>
          <MaterialIcons name="mail-outline" size={20} color="#8A8278" />
          <Text style={styles.helpLabel}>Contact Us</Text>
          <MaterialIcons name="chevron-right" size={20} color="#D8D2C8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.helpRow}>
          <MaterialIcons name="info-outline" size={20} color="#8A8278" />
          <Text style={styles.helpLabel}>About ARIA</Text>
          <MaterialIcons name="chevron-right" size={20} color="#D8D2C8" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Version</Text>
        <View style={styles.versionBox}>
          <Text style={styles.versionLabel}>ARIA Retail Mobile</Text>
          <Text style={styles.versionNumber}>Version 1.0.0</Text>
        </View>
      </View>

      <View style={styles.dangerSection}>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 ARIA Retail. All rights reserved.</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#D8D2C8',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#C97B2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 32,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1814',
  },
  roleText: {
    fontSize: 12,
    color: '#8A8278',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomColor: '#EDE9E0',
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1814',
    marginBottom: 12,
  },
  fieldContainer: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderColor: '#D8D2C8',
    borderWidth: 1,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#8A8278',
    marginLeft: 8,
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: 13,
    color: '#1C1814',
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: '#D8D2C8',
    borderWidth: 1,
  },
  settingLabel: {
    flex: 1,
    fontSize: 13,
    color: '#1C1814',
    marginLeft: 12,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 12,
    color: '#8A8278',
    marginRight: 8,
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: '#D8D2C8',
    borderWidth: 1,
  },
  helpLabel: {
    flex: 1,
    fontSize: 13,
    color: '#1C1814',
    marginLeft: 12,
    fontWeight: '500',
  },
  versionBox: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderColor: '#D8D2C8',
    borderWidth: 1,
    alignItems: 'center',
  },
  versionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1814',
  },
  versionNumber: {
    fontSize: 12,
    color: '#8A8278',
    marginTop: 4,
  },
  dangerSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  logoutButton: {
    paddingVertical: 14,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 11,
    color: '#8A8278',
  },
})
