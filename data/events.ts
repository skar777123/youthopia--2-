
export interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    time: string;
    location: string;
    points: number;
    participants: number | string;
    prizes: {
        first: string;
        second: string;
        third: string;
    };
    registered?: boolean;
    completed?: boolean;
    completedAt?: number;
    feedback?: string;
}

export const eventsData: Event[] = [
    {
        id: 'evt-01',
        name: 'Prism Panel (Debate)',
        description: 'Engage in a stimulating debate on mental health topics, sharpening your critical thinking and public speaking skills.',
        date: 'Sat, Nov 23',
        time: '10:00 AM',
        location: 'Seminar Hall',
        points: 20,
        participants: 20,
        prizes: { first: '7k', second: '5k', third: '3k' }
    },
    {
        id: 'evt-02',
        name: 'Pulse Parade (Group Dance)',
        description: 'Collaborate with your peers to create and perform a dance routine that expresses a story or emotion.',
        date: 'Sat, Nov 23',
        time: '12:00 PM',
        location: 'Quadrangle Stage',
        points: 25,
        participants: 20,
        prizes: { first: '15k', second: '10k', third: '7k' }
    },
    {
        id: 'evt-03',
        name: 'Unmasking Emotions (Mono Act)',
        description: 'A solo performance event where you can explore and portray a range of human emotions.',
        date: 'Sat, Nov 23',
        time: '2:00 PM',
        location: 'Amphitheatre',
        points: 15,
        participants: 20,
        prizes: { first: '5k', second: '3k', third: '2k' }
    },
    {
        id: 'evt-04',
        name: 'Roots in Reverb (Folk Dance)',
        description: 'Showcase the rich cultural heritage through folk dance. A vibrant and energetic event celebrating traditions.',
        date: 'Sat, Nov 23',
        time: '4:00 PM',
        location: 'Quadrangle Stage',
        points: 20,
        participants: 20,
        prizes: { first: '20k', second: '15k', third: '10k' }
    },
    {
        id: 'evt-05',
        name: 'Pigments of Psyche (Painting)',
        description: 'Express your inner world on canvas in this therapeutic and creative session.',
        date: 'Sat, Nov 23',
        time: 'ALL DAY',
        location: 'Art Studio',
        points: 10,
        participants: 20,
        prizes: { first: '5k', second: '3k', third: '2k' }
    },
    {
        id: 'evt-06',
        name: 'Spell of Stock (Psyk Exchange)',
        description: 'A unique mock stock market event focused on psychological concepts. Test your strategy and understanding of human behavior.',
        date: 'Sun, Nov 24',
        time: '10:00 AM',
        location: 'Seminar Hall',
        points: 20,
        participants: 20,
        prizes: { first: '5k', second: '3k', third: '2k' }
    },
    {
        id: 'evt-07',
        name: 'Chords of Confluence (Singing)',
        description: 'A group singing competition to celebrate harmony and collaboration. Bring your voices together to create something beautiful.',
        date: 'Sun, Nov 24',
        time: '11:00 AM',
        location: 'Main Auditorium',
        points: 25,
        participants: 20,
        prizes: { first: '15k', second: '10k', third: '7k' }
    },
    {
        id: 'evt-08',
        name: 'Dreamcraft Deck (Pitch Deck)',
        description: 'Develop and present an innovative idea related to mental wellness. Hone your entrepreneurial and presentation skills.',
        date: 'Sat, Nov 23',
        time: '1:00 PM',
        location: 'Library Wing',
        points: 20,
        participants: 20,
        prizes: { first: '5k', second: '3k', third: '2k' }
    },
    {
        id: 'evt-09',
        name: 'Motion Mirage (Mime)',
        description: 'Tell a story without words. Mime is a powerful art form for expressing complex emotions and situations creatively.',
        date: 'Sun, Nov 24',
        time: '1:00 PM',
        location: 'Amphitheatre',
        points: 15,
        participants: 20,
        prizes: { first: '7k', second: '5k', third: '3k' }
    },
    {
        id: 'evt-10',
        name: 'Scenezone (Skit)',
        description: 'Work in a team to write and perform a short skit on a given theme related to youth and well-being.',
        date: 'Sun, Nov 24',
        time: '3:00 PM',
        location: 'Quadrangle Stage',
        points: 25,
        participants: 15,
        prizes: { first: '15k', second: '10k', third: '7k' }
    },
    {
        id: 'evt-11',
        name: 'Clash of Cadence (Dance Battle)',
        description: 'Showcase your individual dance skills in an exciting head-to-head battle format. Feel the energy and express yourself!',
        date: 'Sun, Nov 24',
        time: '5:00 PM',
        location: 'Quadrangle Stage',
        points: 15,
        participants: 'No cap',
        prizes: { first: '5k', second: '3k', third: '2k' }
    },
    {
        id: 'evt-12',
        name: 'Shadows & Light (Classical Dance)',
        description: 'A solo classical dance event to express timeless stories and emotions through disciplined, graceful movement.',
        date: 'Sat, Nov 23',
        time: '3:00 PM',
        location: 'Main Auditorium',
        points: 15,
        participants: 20,
        prizes: { first: '7k', second: '5k', third: '3k' }
    },
    {
        id: 'evt-13',
        name: 'Aurora Couture (Fashion Show)',
        description: 'Design and showcase outfits based on themes of mental wellness and resilience. A fusion of creativity and confidence.',
        date: 'Sat, Nov 23',
        time: '6:00 PM',
        location: 'Main Auditorium',
        points: 20,
        participants: 20,
        prizes: { first: '15k', second: '10k', third: '7k' }
    },
    {
        id: 'evt-14',
        name: 'Aurora Eloquence (Elocution)',
        description: 'Deliver a powerful speech on a compelling topic. This event is a platform to voice your thoughts and inspire others.',
        date: 'Sun, Nov 24',
        time: '12:00 PM',
        location: 'Seminar Hall',
        points: 15,
        participants: 20,
        prizes: { first: '5k', second: '3k', third: '2k' }
    },
    {
        id: 'evt-15',
        name: 'Note to Self (Solo Singing)',
        description: 'Express your emotions through the power of your voice in this solo singing competition. Choose a song that speaks to you.',
        date: 'Sat, Nov 23',
        time: '5:00 PM',
        location: 'Amphitheatre',
        points: 15,
        participants: 20,
        prizes: { first: '7k', second: '5k', third: '3k' }
    },
    {
        id: 'evt-16',
        name: 'Inkside Out (Creative Writing)',
        description: 'Pen down your thoughts, stories, or poems. A quiet, reflective space to channel your creativity and emotions into words.',
        date: 'Sat, Nov 23',
        time: 'ALL DAY',
        location: 'Library Wing',
        points: 10,
        participants: 20,
        prizes: { first: '5k', second: '3k', third: '2k' }
    },
    {
        id: 'evt-17',
        name: 'Cluescape (Treasure Hunt)',
        description: 'Team up with friends to solve riddles and uncover clues hidden across the campus. A fun-filled adventure of teamwork.',
        date: 'Sun, Nov 24',
        time: '2:00 PM',
        location: 'Campus-wide',
        points: 30,
        participants: 20,
        prizes: { first: '15k', second: '10k', third: '7k' }
    },
    {
        id: 'evt-18',
        name: 'Neuro Muse (Digital Art)',
        description: 'Create stunning digital artwork on themes of mental wellness. Use your favorite tools to bring your vision to life.',
        date: 'Sun, Nov 24',
        time: 'ALL DAY',
        location: 'Digital Lab',
        points: 10,
        participants: 20,
        prizes: { first: '5k', second: '3k', third: '2k' }
    },
    {
        id: 'evt-19',
        name: 'Framestorm (Comic Flow)',
        description: 'Tell a story through a sequence of drawings. Create your own comic strip and share a unique narrative.',
        date: 'Sun, Nov 24',
        time: 'ALL DAY',
        location: 'Art Studio',
        points: 10,
        participants: 20,
        prizes: { first: '5k', second: '3k', third: '2k' }
    },
    {
        id: 'evt-20',
        name: 'Stellar Spoof (Mimicry)',
        description: 'Show off your talent for imitation! A light-hearted event to bring smiles and laughter through mimicry.',
        date: 'Sun, Nov 24',
        time: '4:00 PM',
        location: 'Amphitheatre',
        points: 15,
        participants: 20,
        prizes: { first: '5k', second: '3k', third: '2k' }
    }
];


export const getInitialEvents = (): Event[] => JSON.parse(JSON.stringify(eventsData));
