"use client"

import React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"


interface PaginationProps {
  currentPage: number
  maxPage: number
  onPageChange: (page: number) => void
}

const PaginationComponent: React.FC<PaginationProps> = ({ currentPage, maxPage, onPageChange }) => {
  // 🔒 페이지 유효성 검사
  const handlePageChange = (page: number) => {
    console.log('🔄 페이지 변경 요청:', { page, currentPage, maxPage })
    
    if (page >= 1 && page <= maxPage && page !== currentPage) {
      console.log('✅ 페이지 변경 실행:', page)
      onPageChange(page)
    } else {
      console.log('❌ 페이지 변경 취소:', { 
        valid: page >= 1 && page <= maxPage, 
        different: page !== currentPage 
      })
    }
  }

  // 페이지네이션 범위 계산
  const getVisiblePages = () => {
    const delta = 2 // 현재 페이지 앞뒤로 보여줄 페이지 수
    const range = []
    const rangeWithDots = []

    // 시작과 끝 페이지 계산
    const start = Math.max(1, currentPage - delta)
    const end = Math.min(maxPage, currentPage + delta)

    // 페이지 범위 생성
    for (let i = start; i <= end; i++) {
      range.push(i)
    }

    // 첫 페이지와 줄임표 처리
    if (start > 1) {
      rangeWithDots.push(1)
      if (start > 2) {
        rangeWithDots.push('...')
      }
    }

    // 중간 페이지들 추가
    rangeWithDots.push(...range)

    // 마지막 페이지와 줄임표 처리
    if (end < maxPage) {
      if (end < maxPage - 1) {
        rangeWithDots.push('...')
      }
      rangeWithDots.push(maxPage)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  // 🔍 디버그 로그
  console.log('🔢 PaginationComponent 렌더링:', {
    currentPage,
    maxPage,
    visiblePages,
    canGoPrev: currentPage > 1,
    canGoNext: currentPage < maxPage
  })

  // 🚨 예외 처리
  if (maxPage <= 1) {
    console.log('⚠️ 페이지네이션 숨김: maxPage =', maxPage)
    return null
  }

  // 🔍 로그는 여기처럼 함수 본문에 위치해야 합니다
    console.log('📦 PaginationComponent 렌더링됨');

  return (
    <div className="flex justify-center">
      <Pagination>
        <PaginationContent>
          {/* 이전 버튼 */}
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault() // 🔥 기본 동작 방지
                handlePageChange(currentPage - 1)
              }}
              className={
                currentPage === 1 
                  ? "pointer-events-none opacity-50 cursor-not-allowed" 
                  : "cursor-pointer hover:bg-gray-100"
              }
              disabled={currentPage === 1} // 🔥 disabled 속성 추가
            />
          </PaginationItem>

          {/* 페이지 번호들 */}
          {visiblePages.map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault() // 🔥 기본 동작 방지
                    handlePageChange(page as number)
                  }}
                  isActive={currentPage === page}
                  className={cn(
                    "cursor-pointer hover:bg-gray-100",
                    currentPage === page && "bg-blue-100 text-blue-600 font-semibold"
                  )}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* 다음 버튼 */}
          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault() // 🔥 기본 동작 방지
                handlePageChange(currentPage + 1)
              }}
              className={
                currentPage === maxPage 
                  ? "pointer-events-none opacity-50 cursor-not-allowed" 
                  : "cursor-pointer hover:bg-gray-100"
              }
              disabled={currentPage === maxPage} // 🔥 disabled 속성 추가
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

// 🔥 cn 함수 import 추가 (없다면)
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export default PaginationComponent