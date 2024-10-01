﻿using Project_SWP391.Dtos.Kois;
using Project_SWP391.Model;

namespace Project_SWP391.Mappers
{
    public static class KoiMapper
    {
        public static KoiDto ToKoiDto(this Koi koi)
        {
            return new KoiDto
            {
                KoiId = koi.KoiId,
                KoiName = koi.KoiName,
                Description = koi.Description,
                Price = koi.Price,
                Length = koi.Length,
                YOB = koi.YOB,
                Gender = koi.Gender,
                UpdateDate = koi.UpdateDate,
            };
        }
        public static Koi ToKoiFromCreateDto(this CreateKoiDto createKoi)
        {
            return new Koi
            {
                KoiName = createKoi.KoiName,
                Description = createKoi.Description,
                Price = createKoi.Price,
                Length = createKoi.Length,
                YOB = createKoi.YOB,
                Gender = createKoi.Gender,
                UpdateDate = createKoi.UpdateDate,
                FarmId = createKoi.FarmId,
                VarietyId = createKoi.VarietyId,
            };
        }
    }
}
