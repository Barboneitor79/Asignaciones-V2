import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Profile } from '../hooks/useProfiles';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
  },
  tableCell: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  cell: {
    fontSize: 10,
  },
  monthTitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});

interface AssignmentsPDFProps {
  meetings: Date[];
  assignments: Record<string, Record<string, string>>;
  profiles: Profile[];
  selectedMonth: string;
  roles: string[];
}

const AssignmentsPDF: React.FC<AssignmentsPDFProps> = ({
  meetings,
  assignments,
  profiles,
  selectedMonth,
  roles,
}) => {
  const getAssignedProfileName = (date: string, role: string) => {
    const assignedId = assignments[date]?.[role];
    if (assignedId) {
      const profile = profiles.find((p) => p.id.toString() === assignedId);
      return profile ? profile.name : 'Sin asignar';
    }
    return 'Sin asignar';
  };

  const monthName = new Date(selectedMonth).toLocaleString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Asignaciones para Reuniones</Text>
        <Text style={styles.monthTitle}>{monthName}</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCell}>
              <Text style={styles.headerCell}>Fecha</Text>
            </View>
            {roles.map((role) => (
              <View key={role} style={styles.tableCell}>
                <Text style={styles.headerCell}>{role}</Text>
              </View>
            ))}
          </View>

          {meetings.map((date) => {
            const dateString = date.toISOString().split('T')[0];
            return (
              <View key={dateString} style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={styles.cell}>
                    {date.toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                {roles.map((role) => (
                  <View key={role} style={styles.tableCell}>
                    <Text style={styles.cell}>
                      {getAssignedProfileName(dateString, role)}
                    </Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default AssignmentsPDF;