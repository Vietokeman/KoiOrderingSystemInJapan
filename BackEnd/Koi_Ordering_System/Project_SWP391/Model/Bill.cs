﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_SWP391.Model
{
    public class Bill
    {
        [Key]
        public int BillId { get; set; }
        public string UserFullName { get; set; }
        public float TourPrice { get; set; }
        public float? KoiPrice { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public float TotalPrice { get; set; }
        public string PaymentDate { get; set; }
        public int QuotationId { get; set; }
        [ForeignKey(nameof(QuotationId))]
        public Quotation Quotation { get; set; }
        public string UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public AppUser User { get; set; }

        public ICollection<KoiBill> KoiBills { get; set; } = new List<KoiBill>();

        public PayStatus PayStatus { get; set; }
        public DeliveryStatus DeliveryStatus { get; set; }
    }
}
