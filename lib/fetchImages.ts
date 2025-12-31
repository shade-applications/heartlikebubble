import { getCategoryData } from '../constants/categories';

export interface UnsplashImage {
    id: string;
    url: string;
    width: number;
    height: number;
    height: 1000,
    url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop',
    author: 'Alejandro Escamilla',
    blurhash: 'LNE:v~t700~q_3RjD%IV009F_3IV',
},
{
    id: '5',
        width: 1000,
            height: 1400,
                url: 'https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=1000&auto=format&fit=crop',
                    author: 'Kelsey Doro',
                        blurhash: 'LQE:v~t700~q_3RjD%IV009F_3IV',
    },
{
    id: '6',
        width: 1000,
            height: 1500,
                url: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1000&auto=format&fit=crop',
                    author: 'Jon Tyson',
                        blurhash: 'L9D]~H00?b?b%gofD%Rj009F_3Rj',
    },
{
    id: '7',
        width: 1000,
            height: 1200,
                url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
                    author: 'Baher Khairy',
                        blurhash: 'LQE:v~t700~q_3RjD%IV009F_3IV',
    },
{
    id: '8',
        width: 1000,
            height: 1300,
                url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1000&auto=format&fit=crop',
                    author: 'Hector J. Rivas',
                        blurhash: 'LNE:v~t700~q_3RjD%IV009F_3IV',
    },
{
    id: '9',
        width: 1000,
            height: 1500,
                url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1000&auto=format&fit=crop',
                    author: 'Nadine Shaabana',
                        blurhash: 'L9D]~H00?b?b%gofD%Rj009F_3Rj',
    },
{
    id: '10',
        width: 1000,
            height: 1100,
                url: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?q=80&w=1000&auto=format&fit=crop',
                    author: 'Volkan Olmez',
                        blurhash: 'LQE:v~t700~q_3RjD%IV009F_3IV',
    },
{
    id: '11',
        width: 1000,
            height: 1600,
                url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop',
                    author: 'Taneli Lahtinen',
                        blurhash: 'LNE:v~t700~q_3RjD%IV009F_3IV',
    },
{
    id: '12',
        width: 1000,
            height: 1500,
                url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1000&auto=format&fit=crop',
                    author: 'Simeon Muller',
                        blurhash: 'L9D]~H00?b?b%gofD%Rj009F_3Rj',
    },
{
    id: '13',
        width: 1000,
            height: 1000,
                url: 'https://images.unsplash.com/photo-1501854140884-074bf6b24363?q=80&w=1000&auto=format&fit=crop',
                    author: 'Zhifei Zhou',
                        blurhash: 'LQE:v~t700~q_3RjD%IV009F_3IV',
    },
{
    id: '14',
        width: 1000,
            height: 1400,
                url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
                    author: 'Bailey Zindel',
                        blurhash: 'LNE:v~t700~q_3RjD%IV009F_3IV',
    },
{
    id: '15',
        width: 1000,
            height: 1500,
                url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=1000&auto=format&fit=crop',
                    author: 'Ales Krivec',
                        blurhash: 'L9D]~H00?b?b%gofD%Rj009F_3Rj',
    },
];

// Duplicate list to simulate infinite scroll
const FULL_IMAGES = [...MOCK_IMAGES, ...MOCK_IMAGES.map(i => ({ ...i, id: i.id + '_dup' })), ...MOCK_IMAGES.map(i => ({ ...i, id: i.id + '_dup2' }))];

export const fetchImages = async (): Promise<UnsplashImage[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return FULL_IMAGES;
};

export const getImageById = (id: string) => {
    return FULL_IMAGES.find(img => img.id === id);
}
