import React, { useEffect, useCallback, useState } from 'react'
import { getAllCollections } from '../../apiCalls/collections';
import { useDispatch } from 'react-redux';
import CollectionCard from '../../Components/CollectionCard';
import { setLoading } from '../../redux/loaderSlice';
import toast from 'react-hot-toast';
import theme from '../../lib/theme';

function Collections() {
    const dispatch = useDispatch();
    const [collections, setCollections] = useState([]);

    const fetchCollections = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const collectionsData = await getAllCollections();
            setCollections(collectionsData);
        } catch (error) {
            console.error('Error fetching collections:', error);
            toast.error('Error fetching collections');
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    useEffect(() => {
        fetchCollections();
    }, [fetchCollections]);

    return (
        <div>
            <div className="flex justify-between items-center container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <span 
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase border-b-4 pb-1"
                    style={{ color: theme.colors.text.primary, borderColor: theme.colors.accent.primary }}
                >
                    Collections
                </span>
            </div>
            <CollectionCard collectionsList={collections} />
        </div>
    )
}

export default Collections;
