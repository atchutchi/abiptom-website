'use client';

import { useState, useEffect } from 'react';
import { CHATBOT_CONFIG } from '@/lib/chat/chatbot-config';

interface Service {
  name: string;
  description: string;
}

export function ChatConfig() {
  const [config, setConfig] = useState({
    initialMessage: '',
    priceMessage: '',
    companyInfo: {} as Record<string, string>,
    services: [] as Service[],
  });

  const [newService, setNewService] = useState({ name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/chat/config');
      if (!response.ok) {
        throw new Error('Failed to load configuration');
      }
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Error loading config:', error);
      setError('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setError(null);
      const response = await fetch('/api/chat/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      setIsEditing(false);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving config:', error);
      setError('Erro ao salvar configurações');
    }
  };

  const handleAddService = () => {
    if (newService.name && newService.description) {
      setConfig(prev => ({
        ...prev,
        services: [...prev.services, { ...newService }]
      }));
      setNewService({ name: '', description: '' });
    }
  };

  const handleRemoveService = (index: number) => {
    setConfig(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-center items-center h-64">
          Carregando configurações...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Mensagens do Sistema */}
        <section>
          <h3 className="text-lg font-medium mb-4">Mensagens do Sistema</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Mensagem Inicial
              </label>
              <textarea
                value={config.initialMessage}
                onChange={(e) =>
                  setConfig(prev => ({
                    ...prev,
                    initialMessage: e.target.value
                  }))
                }
                disabled={!isEditing}
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Mensagem de Preços
              </label>
              <textarea
                value={config.priceMessage}
                onChange={(e) =>
                  setConfig(prev => ({
                    ...prev,
                    priceMessage: e.target.value
                  }))
                }
                disabled={!isEditing}
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>
          </div>
        </section>

        {/* Informações da Empresa */}
        <section>
          <h3 className="text-lg font-medium mb-4">Informações da Empresa</h3>
          <div className="grid gap-4">
            {Object.entries(config.companyInfo).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {key}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    setConfig(prev => ({
                      ...prev,
                      companyInfo: {
                        ...prev.companyInfo,
                        [key]: e.target.value
                      }
                    }))
                  }
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Serviços */}
        <section>
          <h3 className="text-lg font-medium mb-4">Serviços</h3>
          <div className="space-y-4">
            {config.services.map((service, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1 p-3 border rounded-md">
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm text-gray-600">
                    {service.description}
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveService(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                  >
                    Remover
                  </button>
                )}
              </div>
            ))}

            {isEditing && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Adicionar Serviço</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nome do serviço"
                    value={newService.name}
                    onChange={(e) =>
                      setNewService(prev => ({
                        ...prev,
                        name: e.target.value
                      }))
                    }
                    className="w-full p-2 border rounded-md"
                  />
                  <textarea
                    placeholder="Descrição do serviço"
                    value={newService.description}
                    onChange={(e) =>
                      setNewService(prev => ({
                        ...prev,
                        description: e.target.value
                      }))
                    }
                    className="w-full p-2 border rounded-md"
                    rows={2}
                  />
                  <button
                    onClick={handleAddService}
                    className="w-full py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500"
                  >
                    Adicionar Serviço
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Ações */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  loadConfig(); // Recarregar configurações originais
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500"
              >
                Salvar Alterações
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500"
            >
              Editar Configurações
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 