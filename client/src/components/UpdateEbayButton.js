import React, { useState } from 'react';
import axios from 'axios';
import { Button, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateEbayButton = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const updateEbayData = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await axios.post('http://localhost:8080/api/ebay/update');
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to update database: ' + (error.response?.data?.error || error.message));
            console.error('Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-center">
            <Button variant="danger" onClick={updateEbayData} disabled={loading} className="my-3">
                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Update eBay Data'}
            </Button>
            {message && (
                <Alert variant={message.includes('Failed') ? 'danger' : 'success'} className="mt-3">
                    {message}
                </Alert>
            )}
        </div>
    );
};

export default UpdateEbayButton;
