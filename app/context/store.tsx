import * as SecureStore from 'expo-secure-store';

export async function save(key: string, value: any) {
    if (value == null) {
        await SecureStore.deleteItemAsync(key);
    } else {
        await SecureStore.setItemAsync(key, value);
    }
}

export async function getValueFor(key: string) {
    let result = await SecureStore.getItemAsync(key);
    return result;
}
