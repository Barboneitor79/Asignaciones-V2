import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import { useProfiles, Profile } from '../hooks/useProfiles';
import AssignmentsPDF from './AssignmentsPDF';

const roles = ['Microfono', 'Audio', 'Video', 'Plataforma'];

const AssignmentsTab: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [meetings, setMeetings] = useState<Date[]>([]);
  const { profiles } = useProfiles();
  const [assignments, setAssignments] = useState<
    Record<string, Record<string, string>>
  >({});

  useEffect(() => {
    const generateMeetings = () => {
      const [year, month] = selectedMonth.split('-').map(Number);
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      const meetingDates: Date[] = [];

      for (
        let d = new Date(firstDay);
        d <= lastDay;
        d.setDate(d.getDate() + 1)
      ) {
        if (d.getDay() === 4 || d.getDay() === 6) {
          meetingDates.push(new Date(d));
        }
      }

      setMeetings(meetingDates);
      generateDefaultAssignments(meetingDates);
    };

    generateMeetings();
  }, [selectedMonth, profiles]);

  const generateDefaultAssignments = (meetingDates: Date[]) => {
    const newAssignments: Record<string, Record<string, string>> = {};

    meetingDates.forEach((date) => {
      const dateString = date.toISOString().split('T')[0];
      newAssignments[dateString] = {};

      roles.forEach((role) => {
        const availableProfiles = getAvailableProfiles(
          dateString,
          role,
          newAssignments
        );
        if (availableProfiles.length > 0) {
          const selectedProfile =
            availableProfiles[
              Math.floor(Math.random() * availableProfiles.length)
            ];
          newAssignments[dateString][role] = selectedProfile.id.toString();
        }
      });
    });

    setAssignments(newAssignments);
  };

  const getAvailableProfiles = (
    date: string,
    role: string,
    currentAssignments: Record<string, Record<string, string>>
  ) => {
    return profiles.filter((profile) => {
      const isQualified = profile.roles.includes(role);
      const isAvailableOnDate = !Object.values(
        currentAssignments[date] || {}
      ).includes(profile.id.toString());
      const isAgeAppropriate = checkAgeAppropriate(
        date,
        role,
        profile,
        currentAssignments
      );
      return isQualified && isAvailableOnDate && isAgeAppropriate;
    });
  };

  const checkAgeAppropriate = (
    date: string,
    role: string,
    profile: Profile,
    currentAssignments: Record<string, Record<string, string>>
  ) => {
    if (role !== 'Audio' && role !== 'Video') return true;
    const otherRole = role === 'Audio' ? 'Video' : 'Audio';
    const otherAssignedId = currentAssignments[date]?.[otherRole];
    if (!otherAssignedId) return true;
    const otherProfile = profiles.find(
      (p) => p.id.toString() === otherAssignedId
    );
    if (!otherProfile) return true;
    if (profile.age < 18 && otherProfile.age < 18) return false;
    return true;
  };

  const assignPerson = (date: string, role: string, personId: string) => {
    setAssignments((prev) => {
      const newAssignments = { ...prev };
      if (!newAssignments[date]) {
        newAssignments[date] = {};
      }
      newAssignments[date][role] = personId;
      return newAssignments;
    });
  };

  const getAssignedProfileName = (date: string, role: string) => {
    const assignedId = assignments[date]?.[role];
    if (assignedId) {
      const profile = profiles.find((p) => p.id.toString() === assignedId);
      return profile ? `${profile.name}` : 'Asignar';
    }
    return 'Asignar';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Asignaciones</h2>
        <PDFDownloadLink
          document={
            <AssignmentsPDF
              meetings={meetings}
              assignments={assignments}
              profiles={profiles}
              selectedMonth={selectedMonth}
              roles={roles}
            />
          }
          fileName={`asignaciones-${selectedMonth}.pdf`}
          className="no-underline"
        >
          {({ loading }) => (
            <Button
              variant="outline"
              className="hover:bg-blue-50 hover:border-blue-200 transition-colors"
              disabled={loading}
            >
              <Download className="mr-2 h-4 w-4" />
              {loading ? 'Generando PDF...' : 'Descargar PDF'}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
        <SelectTrigger className="w-[180px] mb-6 border-gray-200 focus:border-blue-300">
          <SelectValue placeholder="Selecciona un mes" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 12 }, (_, i) => {
            const date = new Date(new Date().getFullYear(), i, 1);
            return (
              <SelectItem key={i} value={date.toISOString().slice(0, 7)}>
                {date.toLocaleString('default', {
                  month: 'long',
                  year: 'numeric',
                })}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="border-b border-gray-200 p-3 text-left text-sm font-semibold text-gray-900">
                Fecha
              </th>
              {roles.map((role) => (
                <th
                  key={role}
                  className="border-b border-gray-200 p-3 text-left text-sm font-semibold text-gray-900"
                >
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {meetings.map((date, index) => {
              const dateString = date.toISOString().split('T')[0];
              return (
                <tr
                  key={dateString}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="border-b border-gray-200 p-3 text-sm text-gray-500">
                    {date.toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>

                  {roles.map((role) => (
                    <td key={role} className="border-b border-gray-200 p-3">
                      <Select
                        value={assignments[dateString]?.[role] || ''}
                        onValueChange={(value) =>
                          assignPerson(dateString, role, value)
                        }
                      >
                        <SelectTrigger className="w-full border-gray-200 focus:border-blue-300 bg-white">
                          <SelectValue>
                            {getAssignedProfileName(dateString, role)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableProfiles(
                            dateString,
                            role,
                            assignments
                          ).map((profile) => (
                            <SelectItem
                              key={profile.id}
                              value={profile.id.toString()}
                            >
                              {profile.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentsTab;