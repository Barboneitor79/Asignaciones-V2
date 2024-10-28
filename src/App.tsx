import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import ProfilesTab from './components/ProfilesTab';
import AssignmentsTab from './components/AssignmentsTab';

function App() {
  const [activeTab, setActiveTab] = useState('profiles');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
          Asignaciones para Reuniones
        </h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full justify-center gap-1 rounded-lg bg-blue-50 p-1">
            <TabsTrigger value="profiles" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700">
              Perfiles
            </TabsTrigger>
            <TabsTrigger value="assignments" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700">
              Asignaciones
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profiles">
            <ProfilesTab />
          </TabsContent>
          <TabsContent value="assignments">
            <AssignmentsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;