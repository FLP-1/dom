/**
 * @fileoverview Script para migrar Grid do Material-UI v1 para v2
 * @directory scripts
 * @description Converte props antigas (xs, sm, md, lg, xl) para nova sintaxe (size)
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

const fs = require('fs')
const path = require('path')

// Função para converter props antigas para nova sintaxe
function convertGridProps(content) {
  // Regex para encontrar Grid com props antigas
  const gridRegex = /<Grid\s+([^>]*?)>/g
  
  return content.replace(gridRegex, (match, props) => {
    // Extrair props antigas
    const xsMatch = props.match(/xs=(\d+)/)
    const smMatch = props.match(/sm=(\d+)/)
    const mdMatch = props.match(/md=(\d+)/)
    const lgMatch = props.match(/lg=(\d+)/)
    const xlMatch = props.match(/xl=(\d+)/)
    
    // Se não há props antigas, retornar como está
    if (!xsMatch && !smMatch && !mdMatch && !lgMatch && !xlMatch) {
      return match
    }
    
    // Construir objeto size
    const sizeObj = {}
    if (xsMatch) sizeObj.xs = parseInt(xsMatch[1])
    if (smMatch) sizeObj.sm = parseInt(smMatch[1])
    if (mdMatch) sizeObj.md = parseInt(mdMatch[1])
    if (lgMatch) sizeObj.lg = parseInt(lgMatch[1])
    if (xlMatch) sizeObj.xl = parseInt(xlMatch[1])
    
    // Remover props antigas
    let newProps = props
      .replace(/xs=\d+/g, '')
      .replace(/sm=\d+/g, '')
      .replace(/md=\d+/g, '')
      .replace(/lg=\d+/g, '')
      .replace(/xl=\d+/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    
    // Adicionar nova prop size
    const sizeStr = JSON.stringify(sizeObj)
    newProps = newProps ? `${newProps} size={${sizeStr}}` : `size={${sizeStr}}`
    
    return `<Grid ${newProps}>`
  })
}

// Função para processar um arquivo
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const newContent = convertGridProps(content)
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8')
      console.log(`✅ Atualizado: ${filePath}`)
      return true
    } else {
      console.log(`⏭️ Sem mudanças: ${filePath}`)
      return false
    }
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message)
    return false
  }
}

// Função para encontrar todos os arquivos JSX
function findJsxFiles(dir) {
  const files = []
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir)
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDirectory(fullPath)
      } else if (item.endsWith('.jsx') || item.endsWith('.js')) {
        files.push(fullPath)
      }
    }
  }
  
  scanDirectory(dir)
  return files
}

// Função principal
function main() {
  const srcDir = path.join(__dirname, '..', 'src')
  const pagesDir = path.join(__dirname, '..', 'pages')
  
  console.log('🔧 Iniciando migração do Grid para Material-UI v2...')
  
  const allFiles = [
    ...findJsxFiles(srcDir),
    ...findJsxFiles(pagesDir)
  ]
  
  let updatedCount = 0
  
  for (const file of allFiles) {
    if (processFile(file)) {
      updatedCount++
    }
  }
  
  console.log(`\n📊 Resumo da migração:`)
  console.log(`- Arquivos processados: ${allFiles.length}`)
  console.log(`- Arquivos atualizados: ${updatedCount}`)
  console.log(`- Arquivos sem mudanças: ${allFiles.length - updatedCount}`)
  
  if (updatedCount > 0) {
    console.log('\n✅ Migração concluída com sucesso!')
    console.log('💡 Execute "npm run lint" para verificar se há outros problemas.')
  } else {
    console.log('\nℹ️ Nenhum arquivo precisou ser atualizado.')
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main()
}

module.exports = { convertGridProps, processFile, findJsxFiles } 