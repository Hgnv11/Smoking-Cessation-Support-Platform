package com.smokingcessation.mapper;

import com.smokingcessation.dto.res.ReasonDTO;
import com.smokingcessation.model.ReasonsQuit;
import com.smokingcessation.model.User;
import com.smokingcessation.model.UserReasons;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-13T21:30:16+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class ReasonMapperImpl implements ReasonMapper {

    @Override
    public ReasonDTO toReasonDTO(ReasonsQuit reasonsQuit) {
        if ( reasonsQuit == null ) {
            return null;
        }

        ReasonDTO reasonDTO = new ReasonDTO();

        reasonDTO.setReasonId( reasonsQuit.getReasonId() );
        reasonDTO.setReasonText( reasonsQuit.getReasonText() );
        reasonDTO.setIsActive( reasonsQuit.getIsActive() );

        return reasonDTO;
    }

    @Override
    public ReasonDTO toReasonDTO(UserReasons userReasons) {
        if ( userReasons == null ) {
            return null;
        }

        ReasonDTO reasonDTO = new ReasonDTO();

        reasonDTO.setReasonId( userReasonsReasonReasonId( userReasons ) );
        reasonDTO.setReasonText( userReasonsReasonReasonText( userReasons ) );
        reasonDTO.setIsActive( userReasonsReasonIsActive( userReasons ) );
        reasonDTO.setUserId( userReasonsUserUserId( userReasons ) );

        return reasonDTO;
    }

    @Override
    public ReasonsQuit toReasonsQuit(ReasonDTO reasonDTO) {
        if ( reasonDTO == null ) {
            return null;
        }

        ReasonsQuit reasonsQuit = new ReasonsQuit();

        reasonsQuit.setReasonId( reasonDTO.getReasonId() );
        reasonsQuit.setReasonText( reasonDTO.getReasonText() );
        reasonsQuit.setIsActive( reasonDTO.getIsActive() );

        return reasonsQuit;
    }

    @Override
    public List<ReasonDTO> toReasonDTOList(List<ReasonsQuit> reasonsQuitList) {
        if ( reasonsQuitList == null ) {
            return null;
        }

        List<ReasonDTO> list = new ArrayList<ReasonDTO>( reasonsQuitList.size() );
        for ( ReasonsQuit reasonsQuit : reasonsQuitList ) {
            list.add( toReasonDTO( reasonsQuit ) );
        }

        return list;
    }

    @Override
    public List<ReasonDTO> toUserReasonDTOList(List<UserReasons> userReasonsList) {
        if ( userReasonsList == null ) {
            return null;
        }

        List<ReasonDTO> list = new ArrayList<ReasonDTO>( userReasonsList.size() );
        for ( UserReasons userReasons : userReasonsList ) {
            list.add( toReasonDTO( userReasons ) );
        }

        return list;
    }

    private Integer userReasonsReasonReasonId(UserReasons userReasons) {
        if ( userReasons == null ) {
            return null;
        }
        ReasonsQuit reason = userReasons.getReason();
        if ( reason == null ) {
            return null;
        }
        Integer reasonId = reason.getReasonId();
        if ( reasonId == null ) {
            return null;
        }
        return reasonId;
    }

    private String userReasonsReasonReasonText(UserReasons userReasons) {
        if ( userReasons == null ) {
            return null;
        }
        ReasonsQuit reason = userReasons.getReason();
        if ( reason == null ) {
            return null;
        }
        String reasonText = reason.getReasonText();
        if ( reasonText == null ) {
            return null;
        }
        return reasonText;
    }

    private Boolean userReasonsReasonIsActive(UserReasons userReasons) {
        if ( userReasons == null ) {
            return null;
        }
        ReasonsQuit reason = userReasons.getReason();
        if ( reason == null ) {
            return null;
        }
        Boolean isActive = reason.getIsActive();
        if ( isActive == null ) {
            return null;
        }
        return isActive;
    }

    private Integer userReasonsUserUserId(UserReasons userReasons) {
        if ( userReasons == null ) {
            return null;
        }
        User user = userReasons.getUser();
        if ( user == null ) {
            return null;
        }
        Integer userId = user.getUserId();
        if ( userId == null ) {
            return null;
        }
        return userId;
    }
}
