import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchCharacters, charactersOptionApi } from './../utils/charactersApi';

const Container = styled.ol`
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    max-width: 1280px;
`;
const Button = styled.button`
    margin: auto;
`;
const CharacterCard = styled.li`
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 10px;
    padding: 10px;
    width: 200px;
    text-align: center;
    cursor: pointer;
    img {
        max-width: 100%;
        border-radius: 50%;
    }
`;
const CharacterContainer = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
const Popup = styled.div`
    color: black;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    z-index: 1000;
`;
const FilterContainer = styled.div`
    display: flex;
    margin-bottom: 20px;
    @media screen and (max-width: 768px) {
        flex-direction: column;
    }
`;

const FilterInput = styled.input`
    margin: 0;
    padding: 0;
`;
const App = () => {
    const [filteredCharacters, setFilteredCharacters] = useState([]);
    const [popupCharacter, setPopupCharacter] = useState(null);
    const [queryParams, setQueryParams] = useState('');
    const [filters, setFilters] = useState({
        name: '',
        status: '',
        species: '',
        gender: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);

    useEffect(() => {
        setCurrentPage(1);
        async function fetchData() {
            try {
                const data = await fetchCharacters(queryParams);
                setFilteredCharacters(data.results);
                setHasNextPage(!!data.info.next);
            } catch (error) {
                console.error('Error fetching characters:', error);
                setFilteredCharacters([]);
            }
        }
        fetchData();
    }, [queryParams]);

    async function fetchMoreCharacters() {
        try {
            const nextPage = currentPage + 1;
            const response = await fetchCharacters(
                `page=${nextPage} ${queryParams}`
            );
            const newData = response.results;
            setFilteredCharacters((prevData) => [...prevData, ...newData]);
            setCurrentPage(nextPage);
            setHasNextPage(Boolean(response.info.next));
        } catch (error) {
            console.error('Error fetching more characters:', error);
        }
    }

    function handleQueryParams() {
        let queryParams = '';
        for (let key in filters) {
            if (filters[key]) {
                queryParams += `&${key}=${filters[key]}`;
            }
        }
        setQueryParams(queryParams);
    }
    const openPopup = (character) => {
        setPopupCharacter(character);
    };

    const closePopup = () => {
        setPopupCharacter(null);
    };
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };
    const filteredData = Object.entries(filters)
        .filter(([key]) => key !== 'name')
        .map(([key, value]) => {
            return (
                <select
                    key={key}
                    name={key}
                    value={value}
                    onChange={handleFilterChange}
                >
                    <option value="">Select {key}</option>
                    {charactersOptionApi[key].map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            );
        });

    return (
        <CharacterContainer>
            <FilterContainer>
                <FilterInput
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={filters.name}
                    onChange={handleFilterChange}
                />
                {filteredData}

                <button onClick={handleQueryParams}>Search</button>
            </FilterContainer>
            <Container>
                {filteredCharacters.map((character) => (
                    <CharacterCard
                        key={character.id}
                        onClick={() => openPopup(character)}
                    >
                        <img src={character.image} alt={character.name} />
                        <h3>{character.name}</h3>
                        <p>Status: {character.status}</p>
                        <p>Species: {character.species}</p>
                        <p>Gender: {character.gender}</p>
                    </CharacterCard>
                ))}
                {popupCharacter && (
                    <Popup>
                        <button onClick={closePopup}>Close</button>
                        <h2>{popupCharacter.name}</h2>
                        <img
                            src={popupCharacter.image}
                            alt={popupCharacter.name}
                        />
                        <p>Status: {popupCharacter.status}</p>
                        <p>Species: {popupCharacter.species}</p>
                        <p>Gender: {popupCharacter.gender}</p>
                        <p>Location: {popupCharacter.location.name}</p>
                    </Popup>
                )}
                {filteredCharacters.length === 0 && <p>Nothing was found</p>}
            </Container>
            {filteredCharacters.length !== 0 && hasNextPage && (
                <Button onClick={fetchMoreCharacters}>More</Button>
            )}
        </CharacterContainer>
    );
};

export default App;
