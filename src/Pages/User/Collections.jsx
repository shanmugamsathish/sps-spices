import React, { useEffect, useCallback, useState } from 'react'
import { getAllCollections } from '../../apiCalls/collections';
import { useDispatch } from 'react-redux';
import CollectionCard from '../../Components/CollectionCard';
import { setLoading } from '../../redux/loaderSlice';
import toast from 'react-hot-toast';

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
            <CollectionCard collectionsList={collections} />
        </div>
    )
}

export default Collections;
