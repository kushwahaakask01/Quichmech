using AutoMapper;
using QuichmechBackend.DTOs.Mechanic;
using QuichmechBackend.DTOs.Review;
using QuichmechBackend.DTOs.ServiceRequest;
using QuichmechBackend.Models;

namespace QuichmechBackend.AutoMapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Mechanic mappings
            CreateMap<Mechanic, MechanicDto>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.User.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.User.LastName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
                .ForMember(dest => dest.Distance, opt => opt.Ignore());

            CreateMap<MechanicProfileDto, Mechanic>();

            // ServiceRequest mappings
            CreateMap<ServiceRequest, ServiceRequestDto>()
                .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src =>
                    src.Customer.User.FirstName + " " + src.Customer.User.LastName))
                .ForMember(dest => dest.CustomerPhone, opt => opt.MapFrom(src => src.Customer.User.PhoneNumber))
                .ForMember(dest => dest.MechanicName, opt => opt.MapFrom(src =>
                    src.Mechanic != null ? src.Mechanic.User.FirstName + " " + src.Mechanic.User.LastName : null))
                .ForMember(dest => dest.MechanicPhone, opt => opt.MapFrom(src =>
                    src.Mechanic != null ? src.Mechanic.User.PhoneNumber : null));

            CreateMap<CreateServiceRequestDto, ServiceRequest>();

            // Review mappings
            CreateMap<Review, ReviewDto>()
                .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src =>
                    src.Customer.User.FirstName + " " + src.Customer.User.LastName))
                .ForMember(dest => dest.MechanicName, opt => opt.MapFrom(src =>
                    src.Mechanic.User.FirstName + " " + src.Mechanic.User.LastName));

            CreateMap<CreateReviewDto, Review>();
        }
    }

}
