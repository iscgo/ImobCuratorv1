/**
 * Properties Service - Supabase Integration
 * Gerenciamento de imóveis
 */

import { supabase } from '@/lib/supabase';
import type { Property } from '@/types';

export const propertiesService = {
  /**
   * Lista todas as propriedades do usuário atual
   */
  async getProperties(filters?: {
    status?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    // Filtros
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters?.minPrice) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters?.bedrooms) {
      query = query.eq('bedrooms', filters.bedrooms);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Erro ao buscar propriedades:', error);
      throw error;
    }

    return { data: data as Property[], count };
  },

  /**
   * Busca uma propriedade por ID
   */
  async getProperty(id: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Erro ao buscar propriedade:', error);
      throw error;
    }

    return data as Property;
  },

  /**
   * Cria uma nova propriedade
   */
  async createProperty(propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('properties')
      .insert({
        ...propertyData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar propriedade:', error);
      throw error;
    }

    console.log('✅ Propriedade criada:', data);
    return data as Property;
  },

  /**
   * Cria múltiplas propriedades (bulk insert)
   */
  async createProperties(properties: Omit<Property, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const propertiesWithUserId = properties.map(prop => ({
      ...prop,
      user_id: user.id,
    }));

    const { data, error } = await supabase
      .from('properties')
      .insert(propertiesWithUserId)
      .select();

    if (error) {
      console.error('❌ Erro ao criar propriedades:', error);
      throw error;
    }

    console.log(`✅ ${data.length} propriedades criadas`);
    return data as Property[];
  },

  /**
   * Atualiza uma propriedade existente
   */
  async updateProperty(id: string, updates: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao atualizar propriedade:', error);
      throw error;
    }

    console.log('✅ Propriedade atualizada:', data);
    return data as Property;
  },

  /**
   * Deleta uma propriedade
   */
  async deleteProperty(id: string) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Erro ao deletar propriedade:', error);
      throw error;
    }

    console.log('✅ Propriedade deletada');
  },

  /**
   * Busca propriedades por texto (full-text search)
   */
  async searchProperties(searchText: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .textSearch('location', searchText, {
        type: 'websearch',
        config: 'portuguese',
      });

    if (error) {
      console.error('❌ Erro ao buscar propriedades:', error);
      throw error;
    }

    return data as Property[];
  },

  /**
   * Associa uma propriedade a um cliente
   */
  async linkPropertyToClient(propertyId: string, clientId: string) {
    const { data, error } = await supabase
      .from('client_properties')
      .insert({
        property_id: propertyId,
        client_id: clientId,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao associar propriedade ao cliente:', error);
      throw error;
    }

    console.log('✅ Propriedade associada ao cliente');
    return data;
  },

  /**
   * Remove associação entre propriedade e cliente
   */
  async unlinkPropertyFromClient(propertyId: string, clientId: string) {
    const { error } = await supabase
      .from('client_properties')
      .delete()
      .eq('property_id', propertyId)
      .eq('client_id', clientId);

    if (error) {
      console.error('❌ Erro ao remover associação:', error);
      throw error;
    }

    console.log('✅ Associação removida');
  },

  /**
   * Busca propriedades de um cliente
   */
  async getClientProperties(clientId: string) {
    const { data, error } = await supabase
      .from('client_properties')
      .select(`
        property_id,
        properties (*)
      `)
      .eq('client_id', clientId);

    if (error) {
      console.error('❌ Erro ao buscar propriedades do cliente:', error);
      throw error;
    }

    return data.map((item: any) => item.properties) as Property[];
  },

  /**
   * Incrementa contador de buscas do usuário
   */
  async incrementSearchCount() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase.rpc('increment_searches');

    if (error) {
      console.error('❌ Erro ao incrementar buscas:', error);
      throw error;
    }

    return data;
  },
};
