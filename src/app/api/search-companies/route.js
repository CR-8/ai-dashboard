import { NextResponse } from 'next/server';
import companies from '../../dashboard/companiesdata.js';

// Function to resolve company name or partial symbol to ticker symbol
function resolveTickerSymbol(input) {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const searchTerm = input.trim().toLowerCase();
  
  // Search by exact company name match
  let match = companies.find(company => 
    company.companyName.toLowerCase() === searchTerm
  );
  
  if (match) {
    return {
      symbol: match.symbol,
      companyName: match.companyName,
      industry: match.industry,
      marketCap: match.marketCap,
      matchType: 'exact_name'
    };
  }

  // Search by symbol (case insensitive)
  match = companies.find(company => 
    company.symbol.toLowerCase() === searchTerm
  );
  
  if (match) {
    return {
      symbol: match.symbol,
      companyName: match.companyName,
      industry: match.industry,
      marketCap: match.marketCap,
      matchType: 'exact_symbol'
    };
  }

  // Search by partial company name match (contains)
  const partialMatches = companies.filter(company => 
    company.companyName.toLowerCase().includes(searchTerm) ||
    searchTerm.split(' ').every(word => 
      company.companyName.toLowerCase().includes(word)
    )
  ).slice(0, 10);
  
  if (partialMatches.length > 0) {
    return {
      symbol: partialMatches[0].symbol,
      companyName: partialMatches[0].companyName,
      industry: partialMatches[0].industry,
      marketCap: partialMatches[0].marketCap,
      matchType: 'partial_name',
      alternativeMatches: partialMatches.slice(1).map(company => ({
        symbol: company.symbol,
        companyName: company.companyName,
        industry: company.industry
      }))
    };
  }

  // Fuzzy search - find closest matches
  const fuzzyMatches = companies.filter(company => {
    const companyWords = company.companyName.toLowerCase().split(' ');
    const searchWords = searchTerm.split(' ');
    
    return searchWords.some(searchWord => 
      companyWords.some(companyWord => 
        companyWord.includes(searchWord) || searchWord.includes(companyWord)
      )
    );
  }).slice(0, 10);

  if (fuzzyMatches.length > 0) {
    return {
      symbol: fuzzyMatches[0].symbol,
      companyName: fuzzyMatches[0].companyName,
      industry: fuzzyMatches[0].industry,
      marketCap: fuzzyMatches[0].marketCap,
      matchType: 'fuzzy_match',
      alternativeMatches: fuzzyMatches.slice(1).map(company => ({
        symbol: company.symbol,
        companyName: company.companyName,
        industry: company.industry
      }))
    };
  }

  return null;
}

// GET endpoint for company search suggestions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query || query.length < 2) {
      return NextResponse.json({ 
        suggestions: [],
        message: 'Query too short. Please enter at least 2 characters.' 
      });
    }

    const resolved = resolveTickerSymbol(query);
    
    if (!resolved) {
      return NextResponse.json({ 
        suggestions: [],
        message: 'No companies found matching your search.' 
      });
    }

    const suggestions = [
      {
        symbol: resolved.symbol,
        companyName: resolved.companyName,
        industry: resolved.industry,
        marketCap: resolved.marketCap,
        matchType: resolved.matchType
      }
    ];

    // Add alternative matches if available
    if (resolved.alternativeMatches) {
      suggestions.push(...resolved.alternativeMatches.map(alt => ({
        ...alt,
        matchType: 'alternative'
      })));
    }

    return NextResponse.json({ 
      suggestions: suggestions.slice(0, 8),
      query,
      totalFound: suggestions.length
    });

  } catch (error) {
    console.error('Error in company search:', error);
    return NextResponse.json(
      { error: 'Failed to search companies', details: error.message },
      { status: 500 }
    );
  }
}

// POST endpoint for symbol resolution
export async function POST(request) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const resolved = resolveTickerSymbol(query);
    
    if (!resolved) {
      return NextResponse.json(
        { error: 'Company not found', query },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      query,
      resolved,
      message: `Successfully resolved "${query}" to ${resolved.symbol} (${resolved.companyName})`
    });

  } catch (error) {
    console.error('Error resolving symbol:', error);
    return NextResponse.json(
      { error: 'Failed to resolve symbol', details: error.message },
      { status: 500 }
    );
  }
}
