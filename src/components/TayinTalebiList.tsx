import React, { useMemo } from 'react';
import { TableRow, TableCell } from '@mui/material';

interface TayinTalebiProps {
  talep: {
    id: number;
    basvuruTarihi: string;
    talepEdilenAdliye: string;
    talepDurumu: string;
  };
  onClick?: () => void;
}

// Tek bir talep satırı için memoized bileşen
const TayinTalebiRow = React.memo(({ talep, onClick }: TayinTalebiProps) => (
  <TableRow onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    <TableCell>{talep.id}</TableCell>
    <TableCell>{new Date(talep.basvuruTarihi).toLocaleDateString('tr-TR')}</TableCell>
    <TableCell>{talep.talepEdilenAdliye}</TableCell>
    <TableCell>{talep.talepDurumu}</TableCell>
  </TableRow>
));

interface TayinTalebiListProps {
  talepler: TayinTalebiProps['talep'][];
  onTalepSelect?: (talep: TayinTalebiProps['talep']) => void;
}

const TayinTalebiList: React.FC<TayinTalebiListProps> = ({ talepler, onTalepSelect }) => {
  // Talepleri tarihe göre sıralama işlemini memoize et
  const sortedTalepler = useMemo(() => {
    return [...talepler].sort((a, b) => 
      new Date(b.basvuruTarihi).getTime() - new Date(a.basvuruTarihi).getTime()
    );
  }, [talepler]);

  return (
    <>
      {sortedTalepler.map((talep) => (
        <TayinTalebiRow 
          key={talep.id} 
          talep={talep} 
          onClick={() => onTalepSelect?.(talep)}
        />
      ))}
    </>
  );
};

export default React.memo(TayinTalebiList); 