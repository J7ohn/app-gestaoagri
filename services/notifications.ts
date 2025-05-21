import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const scheduleHarvestNotification = async (culturaId: number, nome: string, dataColheita: string) => {
  const trigger = new Date(dataColheita);
  trigger.setDate(trigger.getDate() - 7); // Notificar 7 dias antes da colheita

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Colheita Próxima! 🌾",
      body: `A colheita de ${nome} está programada para daqui a 7 dias`,
      data: { culturaId },
    },
    trigger,
  });
};

export const scheduleInsumoLowStockNotification = async (insumoId: number, nome: string, quantidade: number) => {
  if (quantidade <= 10) { // Limite de estoque baixo
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Estoque Baixo! ⚠️",
        body: `O estoque de ${nome} está baixo (${quantidade} unidades restantes)`,
        data: { insumoId },
      },
      trigger: null, // Notificação imediata
    });
  }
};