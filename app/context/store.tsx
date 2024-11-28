import * as SecureStore from 'expo-secure-store';

export async function save(key: string, value: any) {
    try {
        if (value == null) {
            await SecureStore.deleteItemAsync(key);
        } else {
            const serializedValue = JSON.stringify(value);
            await SecureStore.setItemAsync(key, serializedValue);
        }
    } catch (error) {
        console.error('Error saving to SecureStore:', error);
        throw error;
    }
}

export async function getValueFor(key: string) {
    try {
        const result = await SecureStore.getItemAsync(key);
        
        if (result === null) {
          return null;
        }
    
        // Parse the JSON string back to its original form
        return JSON.parse(result);
      } catch (error) {
        console.error('Error reading from SecureStore:', error);
        return null;
      }
}
