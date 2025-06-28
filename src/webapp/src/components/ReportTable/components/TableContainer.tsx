import { cn } from "@/lib/utils"
import { ReactNode, RefObject } from "react"
import styles from '../ReportTable.module.css'
import { getTableStyles } from "../getTableStyles"

export const TableContainer = ({
  children,
  isWideScreen,
  tableContainerRef,
  tableId,
  containerWidth,
  tableWidth,
  className,
}: {
  children: ReactNode
  isWideScreen: boolean
  tableContainerRef: RefObject<HTMLDivElement>
  tableId: string
  containerWidth: number
  tableWidth: number
  className?: string
}) => {
  const containerClass = cn(
    'custom-scrollbar',
    isWideScreen ? styles.tableWideContainer : styles.tableContainer,
    className
  )

  const tableStyles = getTableStyles(tableWidth, isWideScreen, containerWidth)

  const isCampaigns = tableId.includes('CampaignsReport')

  return (
    <div
      className={containerClass}
      ref={tableContainerRef}
      data-table-id={tableId}
    >
      <div>
        <div className="flex flex-col relative" style={tableStyles.container}>
          <div
            className="h-4 bg-tg-background rounded-tl-2xl rounded-tr-2xl"
            style={tableStyles.footer}
          />
          <div className="flex" style={tableStyles.container}>
            <div
              style={tableStyles.side}
              className={cn(
                isCampaigns
                  ? styles.leftTableCampaignsPadding
                  : styles.leftTablePadding
              )}
            />
            {children}
            <div
              style={tableStyles.rightWork}
              className={cn(
                isCampaigns
                  ? styles.rightTableCampaignsPadding
                  : styles.rightTablePadding
              )}
            />
            <div
              style={tableStyles.marginRightBlock}
              className="bg-transparent"
            />
          </div>
          <div
            className="h-4 bg-tg-background rounded-bl-2xl rounded-br-2xl"
            style={tableStyles.footer}
          />
        </div>
      </div>
    </div>
  )
}
