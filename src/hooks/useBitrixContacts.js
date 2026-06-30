import { useState, useEffect } from 'react';
import { fetchAllBitrixContacts, normalizeBitrixContacts } from '../utils/bitrix';
import { useBitrixUsers } from './useBitrixUsers';

let _cachedContacts = null;

export function useBitrixContacts() {
  const [contacts, setContacts] = useState(_cachedContacts || []);
  const [loading, setLoading] = useState(!_cachedContacts);
  const [error, setError] = useState(null);
  const { users, loading: usersLoading } = useBitrixUsers();

  async function fetchContacts() {
    try {
      setLoading(true);
      setError(null);
      const rawContacts = await fetchAllBitrixContacts();
      console.log('Raw contacts:', rawContacts);
      const normalized = normalizeBitrixContacts(rawContacts);
      console.log('Normalized contacts:', normalized);
      
      // Enrich contacts with responsible person details
      const enriched = normalized.map(contact => {
        let enrichedContact = {
          ...contact,
          responsiblePerson: 'Unassigned',
          responsibleTeam: 'Unassigned',
          responsiblePosition: null,
        };

        if (contact.assignedById) {
          const responsibleUser = users.find(u => String(u.id) === String(contact.assignedById));
          if (responsibleUser) {
            enrichedContact = {
              ...enrichedContact,
              responsiblePerson: responsibleUser.fullName,
              responsibleTeam: responsibleUser.teamName,
              responsiblePosition: responsibleUser.position,
            };
          }
        }

        return enrichedContact;
      });
      
      console.log('Enriched contacts:', enriched);
      _cachedContacts = enriched;
      setContacts(enriched);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (_cachedContacts) {
      setContacts(_cachedContacts);
      setLoading(false);
      return;
    }

    if (!usersLoading) {
      fetchContacts();
    }
  }, [usersLoading]);

  function refetch() {
    _cachedContacts = null;
    fetchContacts();
  }

  return { contacts, loading, error, refetch };
}
