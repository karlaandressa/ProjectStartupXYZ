export function formatarTamanho(bytes?: number): string {
    if (bytes === undefined || bytes === null) return '—'
    const unidades = ['B', 'KB', 'MB', 'GB']
    let i = 0
    let valor = bytes
    while (valor >= 1024 && i < unidades.length - 1) {
        valor /= 1024
        i++
    }
    return `${valor.toFixed(1)} ${unidades[i]}`
}

export function formatarData(data?: string): string {
    if (!data) return '—'
    try {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    } catch {
        return data
    }
}