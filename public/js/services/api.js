/**
 * The Home Black - API Integration Service
 * Este serviço gerencia a comunicação com a API RESTful do backend.
 * Implementa CRUD de produtos, listagem de categorias e gerenciamento de pedidos.
 */

const API_BASE_URL = window.location.origin + '/api'; // Ajuste conforme a porta/URL real da API

class ApiService {
    constructor(baseUrl = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * Recupera o token JWT do localStorage
     */
    _getToken() {
        return localStorage.getItem('thb_token');
    }

    /**
     * Helper para realizar requisições HTTP tratadas
     */
    async _request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        // Headers padrão
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        };

        // Injeta token de autenticação se disponível
        const token = this._getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            
            // Trata erros HTTP (ex: 401, 403, 404, 500)
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || `Erro HTTP: ${response.status}`;
                throw new Error(errorMessage);
            }

            // Retorna vazio caso seja status 204 (No Content)
            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error(`Erro na requisição para ${endpoint}:`, error.message);
            throw error;
        }
    }

    /* =========================================================================
       PRODUTOS (CRUD)
       ========================================================================= */

    /**
     * Retorna todos os produtos
     */
    async getProdutos() {
        return this._request('/produtos');
    }

    /**
     * Retorna um produto específico pelo ID
     */
    async getProdutoById(id) {
        return this._request(`/produtos/${id}`);
    }

    /**
     * Cadastra um novo produto
     * @param {Object} produto - { nome, descricao, preco, id_categoria, disponivel }
     */
    async createProduto(produto) {
        return this._request('/produtos', {
            method: 'POST',
            body: JSON.stringify(produto)
        });
    }

    /**
     * Atualiza as informações de um produto existente
     * @param {number|string} id 
     * @param {Object} produto - dados atualizados do produto
     */
    async updateProduto(id, produto) {
        return this._request(`/produtos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(produto)
        });
    }

    /**
     * Remove um produto do sistema
     * @param {number|string} id 
     */
    async deleteProduto(id) {
        return this._request(`/produtos/${id}`, {
            method: 'DELETE'
        });
    }

    /* =========================================================================
       CATEGORIAS
       ========================================================================= */

    /**
     * Retorna todas as categorias de produtos
     */
    async getCategorias() {
        return this._request('/categorias');
    }

    /* =========================================================================
       PEDIDOS
       ========================================================================= */

    /**
     * Retorna a lista de pedidos (Visão Admin)
     */
    async getPedidos() {
        return this._request('/pedidos');
    }

    /**
     * Cria um novo pedido (Visão Cliente)
     * @param {Object} pedido - { itens: [{ id_produto, quantidade, preco_unitario }], forma_pagamento }
     */
    async createPedido(pedido) {
        return this._request('/pedidos', {
            method: 'POST',
            body: JSON.stringify(pedido)
        });
    }

    /**
     * Atualiza o status de um pedido (Visão Admin)
     * @param {number|string} idPedido 
     * @param {string} status - 'pendente' | 'preparo' | 'pronto' | 'entregue'
     */
    async updateOrderStatus(idPedido, status) {
        return this._request(`/pedidos/${idPedido}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
    }

    /**
     * Acompanha o status de um pedido em tempo real (Visão Cliente)
     */
    async getPedidoStatus(idPedido) {
        return this._request(`/pedidos/${idPedido}/acompanhar`);
    }
}

// Exporta globalmente para uso nas páginas EJS
window.apiService = new ApiService();
