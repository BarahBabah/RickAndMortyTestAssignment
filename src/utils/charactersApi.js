import axios from 'axios';
const ROCKANDMORTY_API = 'https://rickandmortyapi.com/api/character';
export const fetchCharacters = async (queryParams) => {
    try {
        const response = await axios.get(`${ROCKANDMORTY_API}/?${queryParams}`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching characters:', error);
    }
};

export const charactersOptionApi = {
    status: ['alive', 'dead', 'unknown'],
    species: ['Human', 'Alien', 'Robot', 'Animal'],
    gender: ['female', 'male', 'genderless', 'unknown'],
}